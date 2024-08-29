BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [country] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [street] NVARCHAR(1000) NOT NULL,
    [avatar] NVARCHAR(1000),
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Companies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [summary] NVARCHAR(1000) NOT NULL,
    [customerRetentionRate] DECIMAL(32,16) NOT NULL,
    [positiveSentiment] DECIMAL(32,16) NOT NULL,
    [negativeSentiment] DECIMAL(32,16) NOT NULL,
    [netSentiment] DECIMAL(32,16) NOT NULL,
    CONSTRAINT [Companies_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Products] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [companyId] INT NOT NULL,
    [rating] DECIMAL(32,16) NOT NULL,
    [earning] DECIMAL(32,16) NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Products_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Competitors] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [link] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Competitors_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Threads] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Threads_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Threads_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Messages] (
    [id] INT NOT NULL IDENTITY(1,1),
    [threadId] INT NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [content] VARCHAR(8000) NOT NULL,
    [display] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Messages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Messages_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Products] ADD CONSTRAINT [Products_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Companies]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Threads] ADD CONSTRAINT [Threads_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [Messages_threadId_fkey] FOREIGN KEY ([threadId]) REFERENCES [dbo].[Threads]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
