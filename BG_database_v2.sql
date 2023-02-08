USE [master]
GO
/****** Object:  Database [BrandingGameManagement]    Script Date: 2/8/2023 2:40:14 PM ******/
CREATE DATABASE [BrandingGameManagement]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'BrandingGameManagement', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\BrandingGameManagement.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'BrandingGameManagement_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\BrandingGameManagement_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [BrandingGameManagement] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BrandingGameManagement].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BrandingGameManagement] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET ARITHABORT OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BrandingGameManagement] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BrandingGameManagement] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET  DISABLE_BROKER 
GO
ALTER DATABASE [BrandingGameManagement] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BrandingGameManagement] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [BrandingGameManagement] SET  MULTI_USER 
GO
ALTER DATABASE [BrandingGameManagement] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BrandingGameManagement] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BrandingGameManagement] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BrandingGameManagement] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [BrandingGameManagement] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [BrandingGameManagement] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [BrandingGameManagement] SET QUERY_STORE = OFF
GO
USE [BrandingGameManagement]
GO
/****** Object:  Table [dbo].[tblAccount]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblAccount](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userName] [nvarchar](100) NOT NULL,
	[password] [nvarchar](100) NOT NULL,
	[roleId] [int] NOT NULL,
 CONSTRAINT [PK_tblAccount] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblAdmin]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblAdmin](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[accountId] [int] NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[roleId] [int] NOT NULL,
	[email] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_tblAdmin] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblBrand]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblBrand](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[accountId] [int] NOT NULL,
	[brandName] [nvarchar](250) NOT NULL,
	[roleId] [int] NOT NULL,
	[phone] [nvarchar](50) NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[quantityStore] [int] NOT NULL,
	[image] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblBrand] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCampaign]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCampaign](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](250) NOT NULL,
	[dateStart] [nvarchar](50) NOT NULL,
	[dateEnd] [nvarchar](50) NOT NULL,
	[budget] [float] NULL,
	[brandId] [int] NOT NULL,
	[gameTypeId] [int] NOT NULL,
	[gameAssetId] [int] NOT NULL,
	[gamePlayId] [int] NOT NULL,
	[gameRuleId] [int] NOT NULL,
	[Status] [bit] NOT NULL,
 CONSTRAINT [PK_tblCampaign] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblGameAssets]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblGameAssets](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sourceGame] [nvarchar](max) NOT NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_tblGameAssets] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblGameRules]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblGameRules](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[voucherTypeId] [int] NOT NULL,
	[probability] [float] NOT NULL,
 CONSTRAINT [PK_tblGameRules] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblGameType]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblGameType](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[type] [nvarchar](100) NOT NULL,
	[description] [nvarchar](max) NOT NULL,
	[image] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblGameType] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblRole]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblRole](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[roleId] [int] NOT NULL,
	[roleName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_tblRole] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblRun]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblRun](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[storeId] [int] NOT NULL,
	[campaignId] [int] NOT NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_tblRun] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblStore]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblStore](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[brandId] [int] NOT NULL,
	[turnId] [int] NOT NULL,
	[adress] [nvarchar](100) NOT NULL,
	[phone] [nvarchar](50) NULL,
	[email] [nvarchar](50) NULL,
 CONSTRAINT [PK_tblStore] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblTurn]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblTurn](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[quantityTurn] [int] NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[voucherId] [int] NOT NULL,
 CONSTRAINT [PK_tblTurn] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblVoucher]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblVoucher](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[voucherTypeId] [int] NOT NULL,
	[quantity] [int] NOT NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_Voucher] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblVoucherType]    Script Date: 2/8/2023 2:40:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblVoucherType](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[brandId] [int] NOT NULL,
	[type] [nvarchar](50) NOT NULL,
	[description] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_tblVoucherType] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[tblAdmin]  WITH CHECK ADD  CONSTRAINT [FK_tblAdmin_tblAccount] FOREIGN KEY([accountId])
REFERENCES [dbo].[tblAccount] ([id])
GO
ALTER TABLE [dbo].[tblAdmin] CHECK CONSTRAINT [FK_tblAdmin_tblAccount]
GO
ALTER TABLE [dbo].[tblAdmin]  WITH CHECK ADD  CONSTRAINT [FK_tblAdmin_tblRole] FOREIGN KEY([roleId])
REFERENCES [dbo].[tblRole] ([id])
GO
ALTER TABLE [dbo].[tblAdmin] CHECK CONSTRAINT [FK_tblAdmin_tblRole]
GO
ALTER TABLE [dbo].[tblBrand]  WITH CHECK ADD  CONSTRAINT [FK_tblBrand_tblAccount] FOREIGN KEY([accountId])
REFERENCES [dbo].[tblAccount] ([id])
GO
ALTER TABLE [dbo].[tblBrand] CHECK CONSTRAINT [FK_tblBrand_tblAccount]
GO
ALTER TABLE [dbo].[tblBrand]  WITH CHECK ADD  CONSTRAINT [FK_tblBrand_tblRole] FOREIGN KEY([roleId])
REFERENCES [dbo].[tblRole] ([id])
GO
ALTER TABLE [dbo].[tblBrand] CHECK CONSTRAINT [FK_tblBrand_tblRole]
GO
ALTER TABLE [dbo].[tblCampaign]  WITH CHECK ADD  CONSTRAINT [FK_tblCampaign_tblBrand] FOREIGN KEY([brandId])
REFERENCES [dbo].[tblBrand] ([id])
GO
ALTER TABLE [dbo].[tblCampaign] CHECK CONSTRAINT [FK_tblCampaign_tblBrand]
GO
ALTER TABLE [dbo].[tblCampaign]  WITH CHECK ADD  CONSTRAINT [FK_tblCampaign_tblGameAssets] FOREIGN KEY([gameAssetId])
REFERENCES [dbo].[tblGameAssets] ([id])
GO
ALTER TABLE [dbo].[tblCampaign] CHECK CONSTRAINT [FK_tblCampaign_tblGameAssets]
GO
ALTER TABLE [dbo].[tblCampaign]  WITH CHECK ADD  CONSTRAINT [FK_tblCampaign_tblGameRules] FOREIGN KEY([gameRuleId])
REFERENCES [dbo].[tblGameRules] ([id])
GO
ALTER TABLE [dbo].[tblCampaign] CHECK CONSTRAINT [FK_tblCampaign_tblGameRules]
GO
ALTER TABLE [dbo].[tblCampaign]  WITH CHECK ADD  CONSTRAINT [FK_tblCampaign_tblGameType] FOREIGN KEY([gameTypeId])
REFERENCES [dbo].[tblGameType] ([id])
GO
ALTER TABLE [dbo].[tblCampaign] CHECK CONSTRAINT [FK_tblCampaign_tblGameType]
GO
ALTER TABLE [dbo].[tblCampaign]  WITH CHECK ADD  CONSTRAINT [FK_tblCampaign_tblTurn] FOREIGN KEY([gamePlayId])
REFERENCES [dbo].[tblTurn] ([id])
GO
ALTER TABLE [dbo].[tblCampaign] CHECK CONSTRAINT [FK_tblCampaign_tblTurn]
GO
ALTER TABLE [dbo].[tblGameRules]  WITH CHECK ADD  CONSTRAINT [FK_tblGameRules_tblVoucherType] FOREIGN KEY([voucherTypeId])
REFERENCES [dbo].[tblVoucherType] ([id])
GO
ALTER TABLE [dbo].[tblGameRules] CHECK CONSTRAINT [FK_tblGameRules_tblVoucherType]
GO
ALTER TABLE [dbo].[tblRun]  WITH CHECK ADD  CONSTRAINT [FK_tblRun_tblCampaign] FOREIGN KEY([campaignId])
REFERENCES [dbo].[tblCampaign] ([id])
GO
ALTER TABLE [dbo].[tblRun] CHECK CONSTRAINT [FK_tblRun_tblCampaign]
GO
ALTER TABLE [dbo].[tblRun]  WITH CHECK ADD  CONSTRAINT [FK_tblRun_tblStore] FOREIGN KEY([storeId])
REFERENCES [dbo].[tblStore] ([id])
GO
ALTER TABLE [dbo].[tblRun] CHECK CONSTRAINT [FK_tblRun_tblStore]
GO
ALTER TABLE [dbo].[tblStore]  WITH CHECK ADD  CONSTRAINT [FK_tblStore_tblBrand1] FOREIGN KEY([brandId])
REFERENCES [dbo].[tblBrand] ([id])
GO
ALTER TABLE [dbo].[tblStore] CHECK CONSTRAINT [FK_tblStore_tblBrand1]
GO
ALTER TABLE [dbo].[tblStore]  WITH CHECK ADD  CONSTRAINT [FK_tblStore_tblTurn] FOREIGN KEY([turnId])
REFERENCES [dbo].[tblTurn] ([id])
GO
ALTER TABLE [dbo].[tblStore] CHECK CONSTRAINT [FK_tblStore_tblTurn]
GO
ALTER TABLE [dbo].[tblTurn]  WITH CHECK ADD  CONSTRAINT [FK_tblTurn_tblVoucher] FOREIGN KEY([voucherId])
REFERENCES [dbo].[tblVoucher] ([id])
GO
ALTER TABLE [dbo].[tblTurn] CHECK CONSTRAINT [FK_tblTurn_tblVoucher]
GO
ALTER TABLE [dbo].[tblVoucher]  WITH CHECK ADD  CONSTRAINT [FK_tblVoucher_tblVoucherType] FOREIGN KEY([voucherTypeId])
REFERENCES [dbo].[tblVoucherType] ([id])
GO
ALTER TABLE [dbo].[tblVoucher] CHECK CONSTRAINT [FK_tblVoucher_tblVoucherType]
GO
ALTER TABLE [dbo].[tblVoucherType]  WITH CHECK ADD  CONSTRAINT [FK_tblVoucherType_tblBrand] FOREIGN KEY([brandId])
REFERENCES [dbo].[tblBrand] ([id])
GO
ALTER TABLE [dbo].[tblVoucherType] CHECK CONSTRAINT [FK_tblVoucherType_tblBrand]
GO
USE [master]
GO
ALTER DATABASE [BrandingGameManagement] SET  READ_WRITE 
GO
