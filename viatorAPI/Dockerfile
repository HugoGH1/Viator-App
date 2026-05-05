FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["EmpresasViator.Api/EmpresasViator.Api.csproj", "EmpresasViator.Api/"]
COPY ["EmpresasViator.Application/EmpresasViator.Application.csproj", "EmpresasViator.Application/"]
COPY ["EmpresasViator.Domain/EmpresasViator.Domain.csproj", "EmpresasViator.Domain/"]
COPY ["EmpresasViator.Infrastructure/EmpresasViator.Infrastructure.csproj", "EmpresasViator.Infrastructure/"]
RUN dotnet restore "./EmpresasViator.Api/EmpresasViator.Api.csproj"
COPY . .
WORKDIR "/src/EmpresasViator.Api"
RUN dotnet build "./EmpresasViator.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./EmpresasViator.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "EmpresasViator.Api.dll"]
