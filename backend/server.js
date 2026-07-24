require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, query, validationResult } = require('express-validator');

const prisma = require('./prisma/client');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const validRoles = ['ADMIN', 'MENTOR', 'STUDENT'];

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const sanitizeUser = ({ password, ...user }) => user;

const signToken = (user) => {
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
};

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be 100 characters or fewer'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .optional()
    .isIn(validRoles)
    .withMessage(`Role must be one of: ${validRoles.join(', ')}`),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

const createProgramValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('description')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be 5000 characters or fewer'),
  body('price')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('thumbnail')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
];

const updateProgramValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('description')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be 5000 characters or fewer'),
  body('price')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('thumbnail')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE', 'ARCHIVED'])
    .withMessage('Status must be one of: DRAFT, ACTIVE, ARCHIVED'),
];

const validLessonTypes = ['VIDEO', 'ARTICLE', 'LIVE', 'ASSIGNMENT'];

const createLessonValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('content')
    .optional({ values: 'null' })
    .isString()
    .withMessage('Content must be a string'),
  body('type')
    .optional()
    .isIn(validLessonTypes)
    .withMessage(`Type must be one of: ${validLessonTypes.join(', ')}`),
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
    .toInt(),
];

const createEnrollmentValidation = [
  body('programId')
    .trim()
    .notEmpty()
    .withMessage('Program ID is required'),
];

const listProgramsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

const mentorPublicSelect = {
  id: true,
  name: true,
  avatar: true,
  bio: true,
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.status(200).json({ user: sanitizeUser(req.user) });
});
app.post('/api/auth/register', registerValidation, handleValidation, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'STUDENT',
      },
    });
    const token = signToken(user);

    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Register error:', error);

    if (error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Unable to register user' });
  }
});

app.post('/api/auth/login', loginValidation, handleValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user);

    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Login error:', error);

    if (error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Unable to log in' });
  }
});

app.post(
  '/api/programs',
  authMiddleware,
  roleMiddleware('MENTOR'),
  createProgramValidation,
  handleValidation,
  async (req, res) => {
    try {
      const { title, description, price, thumbnail } = req.body;

      const program = await prisma.program.create({
        data: {
          title,
          description: description || null,
          price: price != null ? price : null,
          thumbnail: thumbnail || null,
          mentorId: req.user.id,
        },
      });

      return res.status(201).json({ program });
    } catch (error) {
      console.error('Create program error:', error);
      return res.status(500).json({ message: 'Unable to create program' });
    }
  }
);

app.get('/api/programs', listProgramsValidation, handleValidation, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const where = { status: 'ACTIVE' };

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          mentor: { select: mentorPublicSelect },
        },
      }),
      prisma.program.count({ where }),
    ]);

    return res.status(200).json({
      programs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('List programs error:', error);
    return res.status(500).json({ message: 'Unable to fetch programs' });
  }
});

app.get('/api/programs/:id', async (req, res) => {
  try {
    const program = await prisma.program.findFirst({
      where: {
        id: req.params.id,
        status: 'ACTIVE',
      },
      include: {
        mentor: { select: mentorPublicSelect },
        lessons: { orderBy: { order: 'asc' } },
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    return res.status(200).json({ program });
  } catch (error) {
    console.error('Get program error:', error);
    return res.status(500).json({ message: 'Unable to fetch program' });
  }
});

app.put(
  '/api/programs/:id',
  authMiddleware,
  roleMiddleware('MENTOR'),
  updateProgramValidation,
  handleValidation,
  async (req, res) => {
    try {
      const existingProgram = await prisma.program.findUnique({
        where: { id: req.params.id },
      });

      if (!existingProgram) {
        return res.status(404).json({ message: 'Program not found' });
      }

      if (existingProgram.mentorId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this program' });
      }

      const { title, description, price, thumbnail, status } = req.body;
      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price != null ? price : null;
      if (thumbnail !== undefined) updateData.thumbnail = thumbnail || null;
      if (status !== undefined) updateData.status = status;

      const program = await prisma.program.update({
        where: { id: req.params.id },
        data: updateData,
      });

      return res.status(200).json({ program });
    } catch (error) {
      console.error('Update program error:', error);
      return res.status(500).json({ message: 'Unable to update program' });
    }
  }
);

app.delete(
  '/api/programs/:id',
  authMiddleware,
  roleMiddleware('MENTOR'),
  async (req, res) => {
    try {
      const existingProgram = await prisma.program.findUnique({
        where: { id: req.params.id },
      });

      if (!existingProgram) {
        return res.status(404).json({ message: 'Program not found' });
      }

      if (existingProgram.mentorId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this program' });
      }

      const program = await prisma.program.update({
        where: { id: req.params.id },
        data: { status: 'ARCHIVED' },
      });

      return res.status(200).json({ message: 'Program archived successfully', program });
    } catch (error) {
      console.error('Delete program error:', error);
      return res.status(500).json({ message: 'Unable to archive program' });
    }
  }
);

app.post(
  '/api/programs/:id/lessons',
  authMiddleware,
  roleMiddleware('MENTOR'),
  createLessonValidation,
  handleValidation,
  async (req, res) => {
    try {
      const existingProgram = await prisma.program.findUnique({
        where: { id: req.params.id },
      });

      if (!existingProgram) {
        return res.status(404).json({ message: 'Program not found' });
      }

      if (existingProgram.mentorId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this program' });
      }

      let { title, content, type, order } = req.body;

      if (order === undefined || order === null) {
        const maxLesson = await prisma.lesson.findFirst({
          where: { programId: req.params.id },
          orderBy: { order: 'desc' },
          select: { order: true },
        });
        order = maxLesson ? maxLesson.order + 1 : 1;
      }

      const lesson = await prisma.lesson.create({
        data: {
          title,
          content: content || null,
          type: type || 'ARTICLE',
          order,
          programId: req.params.id,
        },
      });

      return res.status(201).json({ lesson });
    } catch (error) {
      console.error('Create lesson error:', error);

      if (error.code === 'P2002') {
        return res
          .status(409)
          .json({ message: 'A lesson with this order already exists in the program' });
      }

      return res.status(500).json({ message: 'Unable to create lesson' });
    }
  }
);

app.get(
  '/api/programs/:id/lessons',
  authMiddleware,
  roleMiddleware('STUDENT', 'MENTOR', 'ADMIN'),
  async (req, res) => {
    try {
      const existingProgram = await prisma.program.findUnique({
        where: { id: req.params.id },
      });

      if (!existingProgram) {
        return res.status(404).json({ message: 'Program not found' });
      }

      const lessons = await prisma.lesson.findMany({
        where: { programId: req.params.id },
        orderBy: { order: 'asc' },
      });

      return res.status(200).json({ lessons });
    } catch (error) {
      console.error('List lessons error:', error);
      return res.status(500).json({ message: 'Unable to fetch lessons' });
    }
  }
);

app.post(
  '/api/enrollments',
  authMiddleware,
  roleMiddleware('STUDENT'),
  createEnrollmentValidation,
  handleValidation,
  async (req, res) => {
    try {
      const { programId } = req.body;

      const program = await prisma.program.findUnique({
        where: { id: programId },
      });

      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }

      if (program.status !== 'ACTIVE') {
        return res.status(400).json({ message: 'Cannot enroll in a program that is not active' });
      }

      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_programId: {
            userId: req.user.id,
            programId,
          },
        },
      });

      if (existingEnrollment) {
        return res.status(409).json({ message: 'You are already enrolled in this program' });
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          userId: req.user.id,
          programId,
          status: 'ACTIVE',
        },
        include: {
          program: {
            include: {
              mentor: { select: mentorPublicSelect },
            },
          },
        },
      });

      return res.status(201).json({ enrollment });
    } catch (error) {
      console.error('Create enrollment error:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'You are already enrolled in this program' });
      }

      return res.status(500).json({ message: 'Unable to enroll in program' });
    }
  }
);

app.get(
  '/api/enrollments/me',
  authMiddleware,
  roleMiddleware('STUDENT'),
  async (req, res) => {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: req.user.id },
        orderBy: { enrolledAt: 'desc' },
        include: {
          program: {
            include: {
              mentor: { select: mentorPublicSelect },
            },
          },
        },
      });

      return res.status(200).json({ enrollments });
    } catch (error) {
      console.error('List my enrollments error:', error);
      return res.status(500).json({ message: 'Unable to fetch enrollments' });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
