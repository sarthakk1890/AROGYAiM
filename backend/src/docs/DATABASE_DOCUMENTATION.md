# MOVA Database Architecture

## Entity Relationship Diagram (ERD)

The MOVA platform utilizes a normalized PostgreSQL database, structured via Prisma ORM. 
It supports multiple user roles (Patient, Physiotherapist, Admin) using a centralized identity model (`User`) linked to specific profile models. Tokens and notifications are isolated in dedicated tables.

```mermaid
erDiagram
    User ||--o| PatientProfile : "has one"
    User ||--o| PhysiotherapistProfile : "has one"
    User ||--o| AdminProfile : "has one"
    User ||--o{ RefreshToken : "has many"
    User ||--o{ VerificationToken : "has many"
    User ||--o{ PasswordResetToken : "has many"
    User ||--o{ Notification : "has many"

    User {
        UUID id PK
        String email "unique"
        String passwordHash
        Enum role "PATIENT | PHYSIOTHERAPIST | ADMIN"
        Enum status "ACTIVE | SUSPENDED | PENDING"
        Boolean emailVerified
        DateTime createdAt
        DateTime updatedAt
        DateTime deletedAt "soft delete"
    }

    PatientProfile {
        UUID id PK
        UUID userId FK "unique"
        String firstName
        String lastName
        DateTime dateOfBirth
        String gender
        String contactNumber
        String medicalHistory
        String currentCondition
        String recoveryGoals
    }

    PhysiotherapistProfile {
        UUID id PK
        UUID userId FK "unique"
        String firstName
        String lastName
        Int experienceYears
        String[] qualifications
        String[] specializations
        Enum verificationStatus "PENDING | VERIFIED | REJECTED"
        String licenseNumber
    }

    AdminProfile {
        UUID id PK
        UUID userId FK "unique"
        String firstName
        String lastName
        String department
    }

    RefreshToken {
        UUID id PK
        UUID userId FK
        String token "unique"
        DateTime expiresAt
        DateTime revokedAt
    }

    VerificationToken {
        UUID id PK
        UUID userId FK
        String token "unique"
        DateTime expiresAt
    }

    PasswordResetToken {
        UUID id PK
        UUID userId FK
        String token "unique"
        DateTime expiresAt
    }

    Notification {
        UUID id PK
        UUID userId FK
        Enum type "SYSTEM | MESSAGE | ALERT"
        String title
        String message
        Boolean isRead
        DateTime createdAt
    }
```

## Schema Highlights

- **Soft Delete**: All critical tables have a `deletedAt` DateTime field. Queries should inherently filter `where: { deletedAt: null }`.
- **Cascading Rules**: All relations to `User` feature `onDelete: Cascade`. Hard deleting a user automatically removes their profile, tokens, and notifications.
- **UUIDs**: All primary keys are UUIDs, improving security (preventing enumeration attacks) and scalability.
- **Transactions**: Core workflows, such as User Registration, wrap Profile and VerificationToken creations inside `$transaction` blocks to ensure atomic data integrity.

## Appointment & Rehabilitation Models

```mermaid
erDiagram
    User ||--o{ Appointment : "patient/physio"
    User ||--o{ Availability : "physio only"
    
    Appointment {
        UUID id PK
        UUID patientId FK
        UUID physiotherapistId FK
        DateTime date
        DateTime startTime
        DateTime endTime
        Enum status
    }

    Availability {
        UUID id PK
        UUID physiotherapistId FK
        Int dayOfWeek
        String startTime
        String endTime
    }

    ExerciseCategory ||--o{ Exercise : "contains"
    Exercise ||--o{ ExercisePlanItem : "included in"
    ExercisePlan ||--o{ ExercisePlanItem : "has many"
    ExercisePlan ||--o| ExercisePlan : "versions (parentPlanId)"
    User ||--o{ ExercisePlan : "physio creates"
    User ||--o{ AssignedExercisePlan : "patient receives"
    ExercisePlan ||--o{ AssignedExercisePlan : "is assigned"
    AssignedExercisePlan ||--o{ ExerciseSession : "schedules"
    ExerciseSession ||--o{ SessionCompletion : "logs"
    
    ExercisePlan {
        UUID id PK
        String name
        Enum status "DRAFT|PUBLISHED"
        Int version
        UUID parentPlanId FK
    }

    AssignedExercisePlan {
        UUID id PK
        UUID patientId FK
        UUID planId FK
        DateTime startDate
        Enum status
    }

    ExerciseSession {
        UUID id PK
        UUID assignedPlanId FK
        DateTime scheduledDate
        Enum status
    }
    
    User ||--o| NotificationPreference : "has one"
    User ||--o{ Notification : "receives"
    
    NotificationPreference {
        UUID id PK
        UUID userId FK
        Boolean inAppEnabled
        Boolean emailEnabled
        Boolean emailAppointmentReminders
        Boolean emailRehabUpdates
        Boolean emailSystemAlerts
    }
```
