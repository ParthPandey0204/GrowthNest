import { useParams, useNavigate, Link } from "react-router-dom";
import { useCourse } from "../../services/course.service";
import { useUpdateLessonProgress, useLessonProgress } from "../../services/enrollment.service";

function LessonView() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const { data: program, isLoading: isProgramLoading } = useCourse(id);
  const { data: lessonProgress = [], isLoading: isProgressLoading } = useLessonProgress(id);
  const updateProgress = useUpdateLessonProgress();
  const completedLessons = new Set(lessonProgress.filter((item) => item.status === "COMPLETED").map((item) => item.lessonId));

  if (isProgramLoading || isProgressLoading) {
    return <div className="h-screen flex items-center justify-center animate-pulse"><div className="h-32 w-32 bg-slate-200 rounded-full"></div></div>;
  }

  if (!program) {
    return <div className="p-8 text-center text-rose-600">Program not found.</div>;
  }

  const currentLessonIndex = program.lessons?.findIndex((l) => l.id === lessonId);
  const currentLesson = program.lessons?.[currentLessonIndex];

  if (!currentLesson) {
    return <div className="p-8 text-center text-rose-600">Lesson not found.</div>;
  }

  const handleMarkComplete = async () => {
    try {
      await updateProgress.mutateAsync({
        lessonId: currentLesson.id,
        status: "COMPLETED",
        progress: 100
      });
      
      const nextLesson = program.lessons[currentLessonIndex + 1];
      if (nextLesson) {
        navigate(`/programs/${id}/lessons/${nextLesson.id}`);
      }
    } catch (error) {
      console.error("Failed to mark lesson as complete", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-200 bg-white overflow-y-auto hidden md:block">
        <div className="p-6 border-b border-slate-200">
          <Link to={`/programs/${id}`} className="text-xs font-medium text-slate-500 hover:text-slate-900 mb-2 block">
            ← Back to Program
          </Link>
          <h2 className="text-lg font-bold text-slate-900">{program.title}</h2>
        </div>
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 ml-2">Lessons</h3>
          <ul className="space-y-1">
            {program.lessons?.map((lesson, index) => {
              const isActive = lesson.id === lessonId;
              const isCompleted = completedLessons.has(lesson.id);
              
              return (
                <li key={lesson.id}>
                  <Link
                    to={`/programs/${id}/lessons/${lesson.id}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-[#0C2B4E] text-white' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full border ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : isActive 
                          ? 'border-sky-300 text-sky-200' 
                          : 'border-slate-300 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <span className="text-[10px] font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className="truncate">{lesson.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-10">
          <header className="mb-6">
            <p className="text-sm font-medium text-sky-600 mb-2">Lesson {currentLessonIndex + 1}</p>
            <h1 className="text-3xl font-bold text-slate-900">{currentLesson.title}</h1>
          </header>

          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-8">
            {currentLesson.type === 'VIDEO' || currentLesson.content?.includes('cloudinary') ? (
              <video 
                src={currentLesson.content || 'https://res.cloudinary.com/demo/video/upload/v1355938833/elephants.mp4'} 
                controls 
                className="w-full h-full object-contain"
                controlsList="nodownload"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                {currentLesson.type} content would go here
              </div>
            )}
          </div>

          <div className="prose prose-slate max-w-none mb-10">
            {currentLesson.description && <p>{currentLesson.description}</p>}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              onClick={handleMarkComplete}
              disabled={updateProgress.isPending || completedLessons.has(currentLesson.id)}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {completedLessons.has(currentLesson.id) ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </button>
            
            {program.lessons[currentLessonIndex + 1] && (
              <Link 
                to={`/programs/${id}/lessons/${program.lessons[currentLessonIndex + 1].id}`}
                className="text-sm font-medium text-[#1D546C] hover:underline"
              >
                Next Lesson &rarr;
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default LessonView;
