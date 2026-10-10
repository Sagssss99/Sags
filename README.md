[README.txt](https://github.com/user-attachments/files/33276161/README.txt)
SAGSS
=====

Bot de Discord para un solo bot/token. El prefijo de comandos es la coma;
el prefijo anterior ya no se usa.

INICIO FACIL:
1. Instala Python 3.11 o superior.
2. Ejecuta start.bat.
3. La primera vez se creara .env.
4. Abre .env y reemplaza TU_TOKEN_DE_BOT en DISCORD_TOKEN con el token de tu bot.
5. Ejecuta start.bat otra vez.

DOCKER:
1. Configura DISCORD_TOKEN en el archivo .env.
2. Desde esta carpeta, ejecuta `docker compose up --build -d`.
   Compose inicia el bot Python completo definido en `Dockerfile`.
3. Consulta los registros con `docker compose logs -f`.
4. Deten el bot con `docker compose down`; los datos se conservan en el volumen
   `sagss-data`.
No subas .env ni incluyas el token en la imagen.

HOSTING:
- Define `DISCORD_TOKEN` como variable de entorno/secret en el panel del hosting;
  no lo pegues en el código, en los logs ni en archivos públicos.
- Configura el comando de inicio como `python main.py` (con Python y las
  dependencias de `requirements.txt` instaladas).
- Activa Message Content Intent, Server Members Intent y Voice States en Discord.
- Monta almacenamiento persistente para la carpeta `data`; ahí se guardan los
  baneos persistentes, la configuración y otros datos. Sin disco persistente,
  el hosting puede borrar esos registros al reiniciar o volver a desplegar.
- No ejecutes dos instancias del bot con el mismo token.

BASE NODE.JS:
- El punto de entrada alternativo e independiente es `node.js`; Compose usa
  `Dockerfile` para iniciar el bot Python completo.
- Instala Node.js 20 o superior y ejecuta `npm install` y `npm start`.
- Reutiliza `DISCORD_TOKEN` desde `.env` y admite `BOT_PREFIX` (por defecto `,`).
- Esta base implementa solo `,ping`; no reemplaza ni migra los comandos Python.
- Activa Message Content Intent en Discord Developer Portal. No ejecutes ambas
  versiones a la vez con el mismo token si no quieres respuestas duplicadas.

COMANDOS:
,help
,help next
,ping
,roles
,r @usuario @rol
,mod ban @usuario [razón]
,mod kick @usuario [razón]
,music play <canción o URL>
,vc setup <categoría> [nombre]
,vc create [nombre]
,vc reset
Usa `,help` para consultar las categorías. Usa `,mod`, `,music`, `,info`,
`,util` o `,vc` para ver las acciones de cada grupo. Los comandos anteriores
siguen funcionando como alias para no romper configuraciones existentes.
`,help` muestra diez comandos por página; usa los botones `Next` y `Previous`
o `,help <número>` para navegar. `,roles` lista los roles del servidor.
`,r @usuario @rol` asigna un rol y requiere Gestionar roles; se respetan
la jerarquía del bot y la del usuario que ejecuta el comando.
Baneo persistente guarda usuario y motivo en `data/bot_data.json`; si se quita
el ban manualmente, el bot lo vuelve a aplicar. `,punban ID` elimina también
el registro persistente. Requiere el permiso Banear miembros y acceso de red
al API de Discord.
`,userinfo` muestra el avatar actual y conserva hasta 20 cambios recientes de
nombres y avatares observados desde que se activó. Discord no permite recuperar
cambios anteriores.
`,limpiarnombres` quita los apodos del servidor y requiere permiso Gestionar
apodos. `,limpiaravatares` lista hasta 50 miembros con avatar personalizado
(global), sin modificar sus avatares.

MODERACION Y SEGURIDAD:
- Los comandos de moderación verifican los permisos requeridos de Discord.
- El administrador raíz es el usuario de Discord `1421710365439299676`.
- Usa `,protectrole @rol` y `,unprotectrole @rol` para gestionar roles protegidos,
  `,addadminuser @usuario` y `,removeadminuser @usuario` para gestionar la
  whitelist, y `,grantadmin @usuario @rol` para asignar un rol protegido.
- Solo el administrador raíz puede cambiar la whitelist global. La whitelist
  y los roles protegidos se guardan en `data/admin_access.json`.
- Solo la whitelist puede ejecutar `,unti` y `,unbanall`. El bot requiere
  Moderar miembros y Banear miembros respectivamente; para vigilar roles
  protegidos necesita Gestionar roles y Ver registro de auditoría, además de
  tener su rol por encima de los roles protegidos.
- Configura los filtros con ,automod true, ,antispam true,
  ,antiinvite true, ,antilink true, ,antimention true y ,antibot true.
- ,antinuke true activa la protección contra eliminaciones de canales/roles y
  ráfagas de baneos/expulsiones. Tras 3 acciones destructivas en 10 segundos,
  expulsa al responsable no autorizado. El propietario y la whitelist global
  están exentos. El bot necesita Ver registro de auditoría y Expulsar miembros.
- ,verification-setup <rol> [canal] configura el rol y el canal de verificación.
- ,security muestra el estado de los filtros.

TICKETS Y COMUNIDAD:
- ,ticket-setup <categoria> [rol_soporte] configura tickets.
- ,ticket <asunto> abre un canal privado; el equipo usa ,ticket-close,
  ,ticket-transcript y ,ticket-delete.
- ,welcome-channel <canal>, ,welcome-message <texto> y ,welcome-enable
  configuran bienvenida. Las variables disponibles son {user} y {server}.
- ,logs-channel <canal> configura el registro de mensajes y voz.

VANITY GUARD:
- ,vanity on <codigo> vigila el codigo vanity actual del servidor.
- ,vanity off desactiva la vigilancia y ,vanity status muestra su estado.
- Solo el administrador raiz `1421710365439299676` puede usar
  ,vanity whitelist @usuario y ,vanity unwhitelist @usuario.
- La whitelist se guarda en `data/vanity_access.json`; la configuracion por servidor
  se guarda en `data/bot_data.json`.
- Discord no permite que los bots restauren codigos vanity mediante la API.
  Si detecta un cambio, el bot avisa al administrador raiz por el canal de logs
  configurado o por mensaje directo; la vanity debe reponerse manualmente.

SORTEOS, NIVELES Y ECONOMIA:
- ,giveaway-start <minutos> <premio> inicia un sorteo con reacción.
- Los mensajes dan XP con un enfriamiento; consulta ,level y ,levels.
- ,daily y ,work dan monedas; ,shop, ,buy y ,inventory administran artículos.

MUSICA:
- Los comandos de audio requieren permisos para conectarse y hablar en voz.
- PyNaCl, davey, yt-dlp e imageio-ffmpeg se instalan automáticamente
  mediante start.bat; imageio-ffmpeg incluye el ejecutable FFmpeg.

VOICE CREATOR:
1. Crea o elige una categoria de voz en tu servidor.
2. Ejecuta ,vc setup <ID_categoria> [nombre] para crear el canal disparador.
   Ejemplo: ,vc setup 123456789012345678 Crear sala
3. Cuando alguien se una al canal disparador, el bot creara otro canal de voz
   dentro de esa categoria y movera alli a la persona.
4. Cualquier miembro puede entrar al canal disparador y a las salas temporales.
   El bot permite la conexión de @everyone en esos canales.
5. Solo el propietario y usuarios de la whitelist pueden ejecutar
,vc setup/create/reset. El propietario o usuarios con
   Gestionar canales administran la whitelist con
   ,vc allow @usuario y ,vc deny @usuario.
6. Usa ,vc whitelist para consultar quién está autorizado,
   ,vc list para ver los disparadores y ,vc remove <canal> para desactivar
   uno sin borrar el canal. ,vc reset desactiva todos los disparadores.
7. Los canales temporales se borran cuando quedan vacíos.

La whitelist es independiente por servidor y se guarda en data/voice_creators.json.
Solo quien tenga Gestionar canales puede cambiar la whitelist.
El bot necesita Gestionar canales y Mover miembros en las categorias/canales.
La ayuda agrupa los comandos de voz bajo la sección Voice Creator.
La configuración de los módulos se guarda en data/bot_data.json. Docker conserva
ambos archivos en un volumen.

IMPORTANTE:
- Usa un BOT normal de Discord, no el token de una cuenta personal.
- Ejecuta una sola instancia por instalación; una segunda se detendrá para evitar
  que el bot responda dos veces a los mismos comandos.
- No compartas el token.
- Mantén el archivo .env privado y no lo subas a repositorios públicos.
- Cada bot debe tener su propio token e intents Message Content, Server Members
  y Voice States habilitados en Discord Developer Portal.
- Si un token se compartió públicamente, revócalo y genera uno nuevo antes de usarlo.
- Este proyecto no incluye funciones de nuking, spam masivo ni destruccion de servidores.
