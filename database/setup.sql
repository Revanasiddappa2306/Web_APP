USE [master]
GO
/****** Object:  Database [Alc_WebFramework]    Script Date: 6/13/2025 12:01:24 PM ******/
CREATE DATABASE [Alc_WebFramework]
GO
ALTER DATABASE [Alc_WebFramework] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Alc_WebFramework].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Alc_WebFramework] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET ARITHABORT OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Alc_WebFramework] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Alc_WebFramework] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Alc_WebFramework] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Alc_WebFramework] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Alc_WebFramework] SET  MULTI_USER 
GO
ALTER DATABASE [Alc_WebFramework] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Alc_WebFramework] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Alc_WebFramework] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Alc_WebFramework] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Alc_WebFramework] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Alc_WebFramework] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Alc_WebFramework] SET QUERY_STORE = OFF
GO
USE [Alc_WebFramework]
GO
/****** Object:  Table [dbo].[Admins]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Admins](
	[AdminID] [varchar](10) NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[MobileNum] [nvarchar](20) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AdminID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Admins_MobileNum] UNIQUE NONCLUSTERED 
(
	[MobileNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Components]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Components](
	[ComponentID] [varchar](10) NOT NULL,
	[ComponentName] [nvarchar](100) NULL,
	[StoragePath] [nvarchar](255) NULL,
	[DataTypeUsed] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[ComponentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CONV_Pass_Down_Table]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CONV_Pass_Down_Table](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Select_Date] [date] NOT NULL,
	[Select_Shift] [nvarchar](255) NOT NULL,
	[ML_headcount_Total] [float] NULL,
	[PACE_Headcount] [float] NULL,
	[CBASS_PArts_Built] [float] NULL,
	[ML_Headcount_Alcon_only] [float] NULL,
	[PREP_Headcount] [float] NULL,
	[CBASS_Scrap] [float] NULL,
	[ALCON_LOA] [float] NULL,
	[Japan_Headcount] [float] NULL,
	[HrsDay] [float] NULL,
	[Alcon_Absence] [float] NULL,
	[Total_PACE_DowntimeMinutes] [float] NULL,
	[OT_Headcount] [float] NULL,
	[Total_PREP_DowntimeMinutes] [float] NULL,
	[WareHouse_Headcount] [float] NULL,
	[Mainline_Issue_DowntimeMinutes] [float] NULL,
	[MAINLINESCOMMENT] [nvarchar](255) NULL,
	[SPB_PREPComment] [nvarchar](255) NULL,
	[SPB_PACEComment] [nvarchar](255) NULL,
	[PATcomment] [nvarchar](255) NULL,
	[WHSComment] [nvarchar](255) NULL,
	[JapanComment] [nvarchar](255) NULL,
	[CBASSComment] [nvarchar](255) NULL,
	[EmployeeComment] [nvarchar](255) NULL,
	[DateTimeEntered] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Select_Date] ASC,
	[Select_Shift] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NewTestPage_Table]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NewTestPage_Table](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Select_Date] [date] NOT NULL,
	[Shift] [nvarchar](255) NOT NULL,
	[Enter_Name] [nvarchar](255) NULL,
	[Enter_Department] [nvarchar](255) NULL,
	[DateTimeEntered] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Select_Date] ASC,
	[Shift] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PageDataTables]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PageDataTables](
	[PageID] [varchar](10) NULL,
	[DataTableName] [nvarchar](100) NULL,
	[CreatedAt] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pages]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pages](
	[PageID] [varchar](10) NOT NULL,
	[PageName] [nvarchar](50) NULL,
	[StoragePath] [nvarchar](255) NULL,
	[CreatedByAdminID] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[PageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Requirements]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Requirements](
	[RequirementID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[521ID] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](150) NOT NULL,
	[Department] [nvarchar](100) NOT NULL,
	[Requirements] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[IsRead] [bit] NOT NULL,
	[Status] [nvarchar](50) NULL,
	[IsDeleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[RequirementID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RolePageAssignments]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RolePageAssignments](
	[PageID] [varchar](10) NOT NULL,
	[RoleID] [varchar](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[PageID] ASC,
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleID] [varchar](10) NOT NULL,
	[Name] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TestPageSiddu_Table]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TestPageSiddu_Table](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Select_Date] [date] NOT NULL,
	[Shift] [nvarchar](255) NOT NULL,
	[Enter_Name] [nvarchar](255) NULL,
	[Enter_Department] [nvarchar](255) NULL,
	[DateTimeEntered] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Select_Date] ASC,
	[Shift] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRoleAssignments]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRoleAssignments](
	[UserID] [varchar](10) NOT NULL,
	[RoleID] [varchar](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC,
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 6/13/2025 12:01:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [varchar](10) NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[MobileNum] [nvarchar](20) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Users_MobileNum] UNIQUE NONCLUSTERED 
(
	[MobileNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[PageDataTables] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Requirements] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Requirements] ADD  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Requirements] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[PageDataTables]  WITH CHECK ADD FOREIGN KEY([PageID])
REFERENCES [dbo].[Pages] ([PageID])
GO
ALTER TABLE [dbo].[Pages]  WITH CHECK ADD FOREIGN KEY([CreatedByAdminID])
REFERENCES [dbo].[Admins] ([AdminID])
GO
ALTER TABLE [dbo].[RolePageAssignments]  WITH CHECK ADD FOREIGN KEY([PageID])
REFERENCES [dbo].[Pages] ([PageID])
GO
ALTER TABLE [dbo].[RolePageAssignments]  WITH CHECK ADD FOREIGN KEY([RoleID])
REFERENCES [dbo].[Roles] ([RoleID])
GO
ALTER TABLE [dbo].[UserRoleAssignments]  WITH CHECK ADD FOREIGN KEY([RoleID])
REFERENCES [dbo].[Roles] ([RoleID])
GO
ALTER TABLE [dbo].[UserRoleAssignments]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
USE [master]
GO
ALTER DATABASE [Alc_WebFramework] SET  READ_WRITE 
GO
