const QUESTIONS = {
  vida: [
    {
      q: '¿Qué harías si tuvieras un año sabático?',
      options: ['Viajar por el mundo', 'Crear algo propio', 'Descansar y leer', 'Estudiar algo nuevo'],
    },
    {
      q: '¿Cómo defines el éxito?',
      options: ['Libertad financiera', 'Impacto en los demás', 'Tiempo con quien amas', 'Lograr lo que te propones'],
    },
    {
      q: '¿Qué te da más miedo del futuro?',
      options: ['La soledad', 'No tener dinero', 'Perder a alguien', 'No haber vivido suficiente'],
    },
    {
      q: '¿Cuándo te sientes más tú mismo/a?',
      options: ['Solo/a en silencio', 'Rodeado/a de gente', 'Creando algo', 'En la naturaleza'],
    },
    {
      q: 'Si pudieras cambiar una decisión pasada, ¿cuál cambiarías?',
      options: ['Una relación', 'Una oportunidad laboral', 'Algo que dije o no dije', 'Nada, todo me trajo aquí'],
    },
    {
      q: '¿Qué necesitas para ser feliz de verdad?',
      options: ['Estabilidad y seguridad', 'Aventura y novedad', 'Conexión profunda con otros', 'Propósito y significado'],
    },
    {
      q: '¿Cómo prefieres enfrentar los problemas?',
      options: ['Solo/a, procesando internamente', 'Hablándolo con alguien', 'Distrayéndome y volviendo después', 'Atacándolos de frente de inmediato'],
    },
    {
      q: '¿Qué tan importante es el reconocimiento para ti?',
      options: ['Lo necesito, me impulsa', 'Me gusta pero no lo busco', 'Me da igual', 'Prefiero pasar desapercibido/a'],
    },
    {
      q: '¿Qué hábito quisieras tener que aún no tienes?',
      options: ['Hacer ejercicio diario', 'Leer más', 'Meditar o descansar bien', 'Ser más ordenado/a'],
    },
    {
      q: '¿Cómo te imaginas en 10 años?',
      options: ['En otro país o ciudad', 'Con familia y hogar propio', 'Con proyecto propio funcionando', 'Con más libertad y viajando'],
    },
  ],

  valores: [
    {
      q: '¿Qué es imperdonable en una relación?',
      options: ['Infidelidad', 'Mentiras sostenidas', 'Violencia emocional', 'Abandonar en momentos difíciles'],
    },
    {
      q: 'En una discusión de pareja, ¿qué haces?',
      options: ['Digo todo lo que siento al momento', 'Me cierro y necesito tiempo', 'Busco solucionar rápido', 'Cedo para evitar el conflicto'],
    },
    {
      q: '¿Qué tan seguido necesitas tiempo solo/a?',
      options: ['Todos los días, es vital', 'Varias veces a la semana', 'De vez en cuando', 'Casi nunca, prefiero compañía'],
    },
    {
      q: '¿Cómo expresas el amor principalmente?',
      options: ['Palabras y mensajes', 'Tiempo de calidad', 'Contacto físico', 'Actos de servicio'],
    },
    {
      q: '¿Qué esperas de una relación seria?',
      options: ['Crecer juntos hacia metas', 'Compañía y apoyo emocional', 'Pasión y conexión física', 'Libertad dentro del compromiso'],
    },
    {
      q: '¿Qué tan rápido te enamoras?',
      options: ['Muy rápido, me entrego fácil', 'Necesito tiempo para confiar', 'Depende totalmente de la persona', 'Me cuesta mucho enamorarme'],
    },
    {
      q: '¿Cuánto espacio personal necesitas en pareja?',
      options: ['Mucho, soy muy independiente', 'Balance entre juntos y separados', 'Prefiero estar la mayor parte juntos', 'Depende de la etapa'],
    },
    {
      q: '¿Cómo sabes que alguien te importa de verdad?',
      options: ['Pienso en esa persona constantemente', 'Quiero que le vaya bien sin estar yo', 'Me incomoda la idea de perderla', 'Cambio hábitos por estar con ella'],
    },
    {
      q: '¿Qué tan seguido dices lo que realmente piensas?',
      options: ['Casi siempre, soy muy directo/a', 'Depende mucho de la persona', 'A veces me guardo cosas', 'Prefiero la diplomacia'],
    },
    {
      q: '¿Cómo manejas los celos?',
      options: ['Los siento poco, confío fácilmente', 'Los proceso solo/a', 'Los expreso abiertamente', 'Me cuestan, son mi punto débil'],
    },
  ],

  dinero: [
    {
      q: '¿Cómo manejarías el dinero en pareja?',
      options: ['Todo junto, somos un equipo', 'Cuentas separadas, cada quien lo suyo', 'Cuenta común + cuentas individuales', 'Dependería de la situación'],
    },
    {
      q: 'Si te cayera dinero inesperado, ¿qué harías?',
      options: ['Ahorrarlo o invertirlo', 'Viaje o experiencia memorable', 'Pagar deudas o pendientes', 'Comprar algo que quiero hace tiempo'],
    },
    {
      q: '¿Cuál es tu relación con las deudas?',
      options: ['Las evito a toda costa', 'Las acepto si son para invertir', 'Las tengo y me generan ansiedad', 'Son una herramienta, no les temo'],
    },
    {
      q: '¿Qué tan compatible debe ser una pareja contigo en lo económico?',
      options: ['Muy compatible, es fundamental', 'Que tenga hábitos sanos, no importa el monto', 'No importa si hay honestidad', 'Es secundario frente a otros valores'],
    },
    {
      q: '¿Pagarías en la primera cita?',
      options: ['Sí, siempre invito yo', 'Propongo dividir desde el inicio', 'Dejo que el otro decida', 'Depende de quién invitó'],
    },
    {
      q: '¿Tienes claridad sobre tu situación financiera?',
      options: ['Sí, llevo control detallado', 'Más o menos, sé lo básico', 'No tanto, vivo al día', 'Prefiero no pensarlo demasiado'],
    },
    {
      q: '¿Trabajarías en algo que no te gusta por buen dinero?',
      options: ['Sí, sin pensarlo dos veces', 'Por tiempo limitado con una meta', 'Solo si no hay otra opción', 'No, el tiempo es muy valioso'],
    },
    {
      q: '¿Cómo reaccionas ante una emergencia económica?',
      options: ['Tengo un fondo de emergencia', 'Recurro a familia o amigos', 'Uso tarjeta y luego resuelvo', 'Me genera mucha ansiedad'],
    },
    {
      q: '¿Qué tan importante es vivir en tu propio espacio?',
      options: ['Fundamental, es mi prioridad', 'Importante pero flexible', 'No me importa mientras esté cómodo/a', 'Lo sacrificaría por ahorrar o amor'],
    },
    {
      q: '¿Cómo defines ser "rico/a"?',
      options: ['Dinero suficiente para no preocuparte', 'Hacer lo que quieras cuando quieras', 'Tener tiempo, no solo dinero', 'Vivir sin deudas y con seguridad'],
    },
  ],

  tabues: [
    {
      q: '¿Qué tanto te importa lo que piensa la gente?',
      options: ['Casi nada, vivo para mí', 'Me importa pero no me paraliza', 'Más de lo que quisiera', 'Depende de quién sea la persona'],
    },
    {
      q: '¿Cómo ves el consumo de drogas recreativas?',
      options: ['Libertad personal, cada quien decide', 'Bien en contextos conscientes', 'Prefiero no involucrarme', 'Creo que hace más daño que bien'],
    },
    {
      q: '¿Qué tan abierto/a eres con tus traumas?',
      options: ['Los comparto pronto, es parte de mí', 'Solo con personas muy cercanas', 'Prefiero procesarlos solo/a', 'Todavía no los he procesado bien'],
    },
    {
      q: '¿Crees que la monogamia es...?',
      options: ['Natural y lo que quiero para mí', 'Construcción social pero válida si se elige', 'Difícil pero posible con trabajo', 'No aplica igual a todos'],
    },
    {
      q: '¿Qué harías si tu pareja te confiesa algo muy difícil de su pasado?',
      options: ['Lo aceptaría, el pasado es pasado', 'Necesitaría tiempo para procesarlo', 'Dependería de qué tan grave', 'Sería un punto de quiebre importante'],
    },
    {
      q: '¿Hablas de salud mental abiertamente?',
      options: ['Sí, sin tabú', 'Con personas de mucha confianza', 'Me cuesta, pero lo intento', 'Prefiero no tocarlo'],
    },
    {
      q: '¿Qué tan importante es la compatibilidad política?',
      options: ['Fundamental, es quien eres', 'Importante pero negociable', 'No me importa si hay respeto', 'Nunca lo vi como requisito'],
    },
    {
      q: '¿Cómo reaccionas ante opiniones muy diferentes a las tuyas?',
      options: ['Debatimos abiertamente, me gusta', 'Escucho pero no cambio fácil mi postura', 'Prefiero evitar el tema', 'Depende de cuán importante sea para mí'],
    },
    {
      q: '¿Qué tanto muestras tu vida en redes sociales?',
      options: ['Casi nada, soy muy privado/a', 'Comparto lo bonito con límites', 'Me gusta documentar y compartir', 'Casi todo, soy bastante abierto/a'],
    },
    {
      q: '¿Cómo te llevas con la religión o espiritualidad?',
      options: ['Tengo fe activa y la practico', 'Creo en algo pero sin religión', 'Soy agnóstico/a o indiferente', 'No creo y lo pienso poco'],
    },
  ],

  sexualidad: [
    {
      q: '¿Qué tan importante es la compatibilidad sexual en una relación?',
      options: ['Fundamental, sin eso no funciona', 'Muy importante pero se trabaja', 'Importante aunque no lo primero', 'Secundaria frente a la conexión emocional'],
    },
    {
      q: '¿Qué papel prefieres en la intimidad?',
      options: ['Tomar el control', 'Ceder el control', 'Intercambiar según el momento', 'Depende de la química'],
    },
    {
      q: '¿Cómo prefieres hablar de deseos y límites?',
      options: ['Directamente y desde el inicio', 'Poco a poco conforme hay confianza', 'Prefiero que fluya natural', 'Me cuesta pero sé que es necesario'],
    },
    {
      q: '¿Qué tan abierto/a eres a explorar cosas nuevas en la intimidad?',
      options: ['Muy abierto/a, me gusta explorar', 'Abierto/a con la persona correcta', 'Tengo claro lo que me gusta', 'Soy más reservado/a en ese tema'],
    },
    {
      q: '¿Qué es lo más importante para ti en la intimidad?',
      options: ['La conexión emocional detrás', 'La presencia y el aquí y ahora', 'La comunicación y confianza', 'La intensidad y el deseo'],
    },
    {
      q: '¿Jugarías con dinámicas de poder?',
      options: ['Sí, me parece muy atractivo', 'Lo exploraría con la persona correcta', 'No es lo mío pero respeto quien sí', 'No lo había contemplado'],
    },
    {
      q: '¿Qué tan seguido necesitas intimidad física en una relación?',
      options: ['Es muy importante, lo necesito seguido', 'Importante pero no lo más prioritario', 'Depende del momento y la conexión', 'No es algo que priorice mucho'],
    },
    {
      q: '¿Comunicarías lo que te gusta desde el inicio?',
      options: ['Sí, prefiero ser directo/a', 'Poco a poco según la confianza', 'Prefiero descubrirlo juntos', 'Me da algo de pena pero lo intento'],
    },
    {
      q: '¿Qué tan cómodo/a estás con tu cuerpo?',
      options: ['Muy cómodo/a, me acepto bien', 'Bien la mayoría del tiempo', 'Trabajo en ello, me cuesta a veces', 'Tengo bastante inseguridad aún'],
    },
    {
      q: '¿Qué importancia tiene la exclusividad en una relación?',
      options: ['Total, no concibo otra cosa', 'Muy importante, lo hablo pronto', 'Depende de lo que acordemos', 'Soy bastante flexible al respecto'],
    },
  ],
}

module.exports = { QUESTIONS }
