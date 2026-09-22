import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

const recentTeacherUploads = [
  {
    id: "up-1",
    teacherName: "Prof. Carlos Menéndez",
    subject: "Matemáticas 4A",
    fileType: "PDF",
    fileName: "Examen Parcial 1.pdf",
    time: "Hace 2 horas",
    icon: "picture_as_pdf"
  },
  {
    id: "up-2",
    teacherName: "Prof. Ana García",
    subject: "Química 3A",
    fileType: "DOCX",
    fileName: "Syllabus_2025.docx",
    time: "Hace 5 horas",
    icon: "description"
  },
  {
    id: "up-3",
    teacherName: "Dr. Roberto Salgado",
    subject: "Biología 2B",
    fileType: "XLSX",
    fileName: "Registro_Notas_Q1.xlsx",
    time: "Ayer",
    icon: "table"
  }
];

export function AdminSupervisionView() {
  const groupedUploads = recentTeacherUploads.reduce((acc, upload) => {
    if (!acc[upload.subject]) acc[upload.subject] = [];
    acc[upload.subject].push(upload);
    return acc;
  }, {} as Record<string, typeof recentTeacherUploads>);

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          <h1 className="text-headline-md font-semibold">Supervisión Docente</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">Registro de actividad reciente subdividida por materias.</p>
        </div>
        <Button variant="secondary" className="h-10 rounded-xl px-4">
          <Icon name="filter_list" className="text-[20px]" />
          Filtros
        </Button>
      </div>

      <div className="flex flex-col gap-8 mt-4 max-w-5xl">
        {Object.entries(groupedUploads).map(([subject, uploads]) => (
          <div key={subject} className="flex flex-col gap-4">
            <h2 className="text-title-lg font-bold flex items-center gap-2 text-primary">
              <Icon name="folder_open" className="text-[24px]" />
              {subject}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex flex-col justify-between gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary shadow-sm">
                      <Icon name={upload.icon} className="text-[24px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-body-lg line-clamp-1">{upload.fileName}</h3>
                      <p className="text-body-sm text-on-surface-variant mt-1">
                        Subido por <span className="font-medium text-on-surface">{upload.teacherName}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-sm font-semibold text-on-secondary-container">{upload.fileType}</span>
                        <span className="text-label-sm text-primary">{upload.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="h-10 rounded-xl px-4 text-sm w-full">
                    <Icon name="visibility" className="text-[20px]" />
                    Ver Documento
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
