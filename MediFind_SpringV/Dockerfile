# --- Etapa 1: Construcción (Builder) ---
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Copiamos los archivos de configuración de Gradle primero
# Esto ayuda a que Docker guarde en caché las dependencias si no cambian
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Damos permisos de ejecución al wrapper de Gradle
RUN chmod +x ./gradlew

# Descargamos dependencias
RUN ./gradlew dependencies --no-daemon

# Copiamos el código fuente
COPY src ./src

# Compilamos el proyecto omitiendo las pruebas para agilizar el proceso
RUN ./gradlew clean build -x test --no-daemon

# --- Etapa 2: Ejecución (Runtime) ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos únicamente el archivo .jar generado en la etapa anterior
COPY --from=builder /app/build/libs/*.jar app.jar

# Exponemos el puerto por defecto de Spring Boot
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]