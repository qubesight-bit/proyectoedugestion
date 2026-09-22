import { Course, Student, Teacher, ChartBar, AnnouncementType, Role } from "../types";

export const logoUrl = "/logo_cartago.png";

export const profileUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAsU0n9vIMhCcBNeXrsZupFuWwIn1TXFabF1GsR-5mMut-1KPtA27oTbUvx3t4mRaeeSkSC6VrWAIs80d-LGPhZoChl6o4mgMXOH3wRs4z0cLKj-zDqYOOPi0u_2JU1uCRH44nyXK-vEsRP-EPPlpjBaIAWtWJErhAAxZV-s4HcPnWjmMzg9szKz8cVfxXRnjEPcDxFUg8I5njsLWdrG0u_dREB4jVZpzJ_o6tHmVB11n2UBTaRxHVIvQ";

export const teacherFaces = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAZrVRSRKciy9svwx4BfCusB5TJcLAgrVtx306N9zoz_eo0TEekE-wls7jpIowFKu-pRSEaEP17JYBpYQHeC4xXXotFvywPAzP_A2PHJUhOTuZqQU6wm8rZ_4x6bZaWP5d8dmLbLaMSza7rvOZJlUc4IJ48nLdkBVbw6WKae22PAcODFidKUC1-SiE5-dYoS5OhexG60NpXfntPbxqQf76obc0Yq8YPQL1zctzP5u4SihJqkmPhwuM7Qw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD9cDdKgjVFhTkWyjyQ2ChcPqtAtsGBZRpUpz5Us1Zg9PmKr6QXGAKbxBJIOqEveCVVyzuT3Yah1NtqKCmZt3YzDmzu6RI8Tmt5xysBJNzx4YiJ6EnK1WIp3moaELMQDiYyUn1gONCM6WnYecVtTFuZvNHJNeyKqVfzeKjOSlCnMTeGB01gX2h8KMoiWkX99zmlwo1dpuqShwvigQD4J8If6pRV9uQJMEMHwYo7_Oqk4srAEWTpRnLPzw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0CX2QR1KQzWVBULqzW8F9MpV0PD3bbrTQgfD5u4HRy8dx744ZD6PWryZCbB_1WKWpvLLcXJRUA0IZdd_dtAxFF1sP4-IurHrcBgOKiJ8UtQo7rNglJe7nCNT94SvP7snIGStTgJOjnBR1b6QvaFA3DWt4oGvf03911f56_3g5ncIvQ0SsRaE-4IgCUIoqbGRnMzCELc_MEiO_Y_NOYJs89FPEZqI7v6f4g51PF-i8SHZEZZq83Ds5SQ",
] as const;

export const studentImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAsPemPGMLES2DZjlzwpWVMjpQzFDpi8eN9Nf-Tb4TYjPOqEQkhZa7jKHUxb9K-OTQSeYfpbyLylT_OnfCF_6zVfMsVI2oP-1iTahMCZ-vMg8HcciPCEkjm3efrmqAAnEMVZWTCp24oHJ4t32Jqwqv7iErCEYSx8egT_lxrlXaktYOpg2QgB79i_SXRBd8q77MU6ALKMEI18YRBR7UvKme7i55UQhLmx2580fKkKetshLeUeXdwWq9EsA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAc12AYzHjzUA3rgnlq0mhaSaCX6uhp81jBR8wGaQsdTqWeW34fbVv1oNlA2I-8x80qSzC5Fk-MTGXcDJxuc3b2cYGSToIuSspE8BYtORxneZnmR-EQoJTI95gMtNyd5ppxf-kc2ykXKihOM20GRfMEaVMjLeP2GClpK-_sp2Gfy7IhFWSqhRDle4eXexihy2963OtzczxsUqjp5U2htZkbJz1-Ynd1Pbx65dmKk5O6xy5uRv7ueU22mw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB-y9nlIkFaqE6S34ovdXLj-IjOcSEwClIIHeKi56vktCy0vyyIOFYRV8T8nUgg23sQHiUsb9JCvsjcWDsmvReluDaOpOYRf2SA6KIcq-PBTlJ3DuA6QT2yXYgm5wE_Qg_C23Q80DtijfcMI5lw70loE5cNnnMuBexTj0tT6j9CBR8AjzrtqUeg7DSE4NFPToiRXJHjso3Sb_5cPzMvuoQcR2NbEc7Mp_4Pk2fKc0yCrXz21axY2mt-hg",
] as const;

export const announcementImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCpIF5S-QJGInEvozN2tJMBXKVWr_l6AWyPp8yVQlmADxhdDNZRdhw-ZWzefi_W2UjCp4uRscFbpzXbGqZKPME-ux7TMR-PQCDpbXnghk2tjIIGzT8sHveipD4QFtZlo_xU5cmSpjVZxGqV1dRDGvfahKeLqQTR-UDrscphI_q0WG0ba4axfCL5rBnFeqN9ew3dBcVb9XE9897TwPqvviXVhth7qK-XIg6jlq8FjCA0ufwf9Z-1B87Yaw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBRqNTtxysBylX80C7orWPLY0v83r8TCCqy8ZlZ3TX5tj8F68Ad8P1dtSBvh1MUFh3u4J4r_LkrBiHltHkFU_5jeY_LqsFFwzX1R_34fJtCk6Cx15kQvFVkYwS1YES--8Gu3gc6wv6g-q8AbntFKgBOE0R9amnaqOMwFwMeoERRw-SnN61JdjgAWCk_xVzEQDtLjFtkfDFp0mblTn6o98Vvgzt1e_6BXbxok3wWIv4PDURfJm22XWlVQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAGkT9TgxkSdXUB0tjEVizcITJjIHgyGbZbFWBhBbFdLD3qiUsWtMinpzsu-o0JcoyY-tA_JBXl08fimAIJ6pW7QMb-meDftxQPB3BdNOUb9h856B_bETPjnQNeBGrsWEkHGGIy7N60h27ioKLSWkm1IEhd1Z1LV2jNFnwDJGx3cuN-fNB5oL926hjqCNDi5n4_HHzKL0sZblYig_1uhtGRoOb3lZmsMdlc2ejOgO22DGVyq9VCuEkDSA",
] as const;

export const roleOptions: Array<[string, string, string]> = [
  ["admin_panel_settings", "Administrador", "Acceso total institucional"],
  ["school", "Docente", "Gestión de cursos y notas"],
];

export const courses: Course[] = [
  {
    category: "ciencias",
    level: "3° de Secundaria",
    tag: "Ciencias Exactas",
    title: "Matemáticas Avanzadas y Cálculo",
    teacher: "Prof. Carlos Menéndez",
    schedule: "Lun y Mié • 08:00 - 09:30 hrs",
    room: "Aula Magna 204 • Pabellón B",
    capacityLabel: "Capacidad de aula",
    occupancy: "28 / 30 ocupados (93%)",
    note: "¡Últimos 2 cupos disponibles antes de lista de espera!",
    count: 28,
    icon: "room",
    face: teacherFaces[0],
  },
  {
    category: "humanidades",
    level: "2° de Secundaria",
    tag: "Humanidades",
    title: "Lengua Española y Literatura",
    teacher: "Prof. Patricia Valenzuela",
    schedule: "Mar y Jue • 10:00 - 11:30 hrs",
    room: "Salón 108 • Edificio Central",
    capacityLabel: "Capacidad de aula",
    occupancy: "22 / 30 ocupados (73%)",
    note: "8 cupos regulares disponibles",
    count: 22,
    icon: "room",
    face: teacherFaces[1],
  },
  {
    category: "ciencias",
    level: "4° de Secundaria",
    tag: "Laboratorio Práctico",
    title: "Biología Celular y Laboratorio",
    teacher: "Dr. Roberto Salgado",
    schedule: "Viernes • 08:30 - 12:00 hrs",
    room: "Laboratorio de Bioquímica 3",
    capacityLabel: "Capacidad de laboratorio",
    occupancy: "15 / 20 ocupados (75%)",
    note: "Cupo máximo limitado por protocolos de bioseguridad",
    count: 15,
    icon: "science",
    face: teacherFaces[2],
  },
];

export const students: Student[] = [
  {
    name: "Camilo Andrés Morales",
    id: "EST-2024-089",
    status: "Activo",
    grade: "4° Primaria 'A'",
    score: "9.2",
    trend: "star",
    tutor: "M. Morales",
    image: studentImages[0],
    alert: "",
  },
  {
    name: "Valentina Sofía Ríos",
    id: "EST-2024-112",
    status: "Activo",
    grade: "2° Secundaria 'B'",
    score: "8.4",
    trend: "trending_up",
    tutor: "E. Ríos G.",
    image: studentImages[1],
    alert: "",
  },
  {
    name: "Matías Herrera Vera",
    id: "EST-2024-045",
    status: "Doc. Pendiente",
    grade: "1° Secundaria 'C'",
    score: "7.9",
    trend: "remove",
    tutor: "",
    image: studentImages[2],
    alert: "Falta Certificado Médico",
  },
];

export const teachersMock: Teacher[] = [
  {
    id: "DOC-2024-001",
    name: "Prof. Carlos Menéndez",
    subject: "Matemáticas y Cálculo",
    status: "Activo",
    classes: 4,
    rating: "4.8",
    image: teacherFaces[0],
    alert: "",
  },
  {
    id: "DOC-2024-002",
    name: "Lic. Patricia Valenzuela",
    subject: "Literatura y Lenguaje",
    status: "Activo",
    classes: 5,
    rating: "4.9",
    image: teacherFaces[1],
    alert: "",
  },
  {
    id: "DOC-2024-003",
    name: "Dr. Roberto Salgado",
    subject: "Biología y Química",
    status: "Activo",
    classes: 3,
    rating: "4.7",
    image: teacherFaces[2],
    alert: "Certificado de primeros auxilios por vencer",
  },
  {
    id: "DOC-2024-004",
    name: "MSc. Andrea Morales",
    subject: "Historia y Geografía",
    status: "Permiso",
    classes: 0,
    rating: "4.6",
    image: teacherFaces[0],
    alert: "Permiso de maternidad",
  },
  {
    id: "DOC-2024-005",
    name: "Prof. Diego Ramírez",
    subject: "Educación Física y Deportes",
    status: "Activo",
    classes: 6,
    rating: "4.9",
    image: teacherFaces[1],
    alert: "",
  },
];

export const chartBars: ChartBar[] = [
  { month: "May", value: "28", height: "h-14", kind: "real" },
  { month: "Jun", value: "34", height: "h-[4.5rem]", kind: "real" },
  { month: "Jul", value: "41", height: "h-[5.5rem]", kind: "real" },
  { month: "Ago", value: "52", height: "h-28", kind: "real" },
  { month: "Sep", value: "37", height: "h-20", kind: "real" },
  { month: "Oct", value: "45*", height: "h-24", kind: "estimate" },
];
