using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class a : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brand",
                columns: table => new
                {
                    BrandId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandCode = table.Column<string>(unicode: false, maxLength: 30, nullable: false),
                    PhoneNumber = table.Column<string>(unicode: false, maxLength: 11, nullable: false),
                    ImgUrl = table.Column<string>(unicode: false, maxLength: 2048, nullable: true),
                    BrandName = table.Column<string>(maxLength: 50, nullable: false),
                    CompanyName = table.Column<string>(maxLength: 50, nullable: false),
                    Description = table.Column<string>(maxLength: 100, nullable: true),
                    Address = table.Column<string>(maxLength: 100, nullable: true),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    BrandEmail = table.Column<string>(unicode: false, maxLength: 62, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brand", x => x.BrandId);
                });

            migrationBuilder.CreateTable(
                name: "GameMaster",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    MinItem = table.Column<int>(nullable: false),
                    MaxItem = table.Column<int>(nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameMaster", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Membership",
                columns: table => new
                {
                    MembershipId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    PhoneNumber = table.Column<string>(unicode: false, maxLength: 12, nullable: false),
                    Email = table.Column<string>(unicode: false, maxLength: 62, nullable: false),
                    Fullname = table.Column<string>(maxLength: 50, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Membership", x => x.MembershipId);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Action",
                columns: table => new
                {
                    ActionId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    ActionType = table.Column<int>(nullable: false),
                    DiscountQuantity = table.Column<int>(nullable: true),
                    DiscountAmount = table.Column<decimal>(type: "decimal(10, 0)", nullable: true),
                    DiscountPercentage = table.Column<decimal>(type: "decimal(18, 0)", nullable: true),
                    FixedPrice = table.Column<decimal>(type: "decimal(10, 0)", nullable: true),
                    MaxAmount = table.Column<decimal>(type: "decimal(10, 0)", nullable: true),
                    MinPriceAfter = table.Column<decimal>(type: "decimal(10, 0)", nullable: true),
                    OrderLadderProduct = table.Column<int>(nullable: true),
                    LadderPrice = table.Column<decimal>(type: "decimal(10, 0)", nullable: true),
                    BundlePrice = table.Column<decimal>(type: "decimal(10, 0)", nullable: true),
                    BundleQuantity = table.Column<int>(nullable: true),
                    BundleStrategy = table.Column<int>(nullable: true),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Name = table.Column<string>(maxLength: 100, nullable: true),
                    BrandId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Action", x => x.ActionId);
                    table.ForeignKey(
                        name: "FK_Action_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Channel",
                columns: table => new
                {
                    ChannelId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: true),
                    ChannelName = table.Column<string>(maxLength: 50, nullable: false),
                    ChannelCode = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Group = table.Column<int>(nullable: true),
                    ChannelType = table.Column<int>(nullable: true),
                    ApiKey = table.Column<string>(unicode: false, maxLength: 44, nullable: true),
                    PublicKey = table.Column<string>(unicode: false, maxLength: 600, nullable: true),
                    PrivateKey = table.Column<string>(unicode: false, maxLength: 2240, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Channel", x => x.ChannelId);
                    table.ForeignKey(
                        name: "FK_Channel_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ConditionRule",
                columns: table => new
                {
                    ConditionRuleId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: false),
                    RuleName = table.Column<string>(maxLength: 50, nullable: false),
                    Description = table.Column<string>(maxLength: 200, nullable: true),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConditionRule", x => x.ConditionRuleId);
                    table.ForeignKey(
                        name: "FK_ConditionRule_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MemberLevel",
                columns: table => new
                {
                    MemberLevelId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberLevel", x => x.MemberLevelId);
                    table.ForeignKey(
                        name: "FK_MemberLevel_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProductCategory",
                columns: table => new
                {
                    ProductCateId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: false),
                    CateId = table.Column<string>(unicode: false, maxLength: 30, nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    DelFlg = table.Column<bool>(nullable: false),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategory", x => x.ProductCateId);
                    table.ForeignKey(
                        name: "FK_ProductCategory_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Promotion",
                columns: table => new
                {
                    PromotionId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: false),
                    PromotionCode = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    PromotionName = table.Column<string>(maxLength: 100, nullable: false),
                    ActionType = table.Column<int>(nullable: false),
                    PostActionType = table.Column<int>(nullable: false),
                    ImgUrl = table.Column<string>(unicode: false, maxLength: 2048, nullable: true),
                    Description = table.Column<string>(maxLength: 4000, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Exclusive = table.Column<int>(nullable: false),
                    ApplyBy = table.Column<int>(nullable: false),
                    SaleMode = table.Column<int>(nullable: false),
                    Gender = table.Column<int>(nullable: false),
                    PaymentMethod = table.Column<int>(nullable: false),
                    ForHoliday = table.Column<int>(nullable: false),
                    ForMembership = table.Column<int>(nullable: false),
                    DayFilter = table.Column<int>(nullable: false),
                    HourFilter = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    HasVoucher = table.Column<bool>(nullable: false),
                    IsAuto = table.Column<bool>(nullable: false),
                    PromotionType = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Promotion", x => x.PromotionId);
                    table.ForeignKey(
                        name: "FK_Promotion_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Store",
                columns: table => new
                {
                    StoreId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: false),
                    StoreCode = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    StoreName = table.Column<string>(maxLength: 50, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    Group = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Store", x => x.StoreId);
                    table.ForeignKey(
                        name: "FK_Store_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Transaction",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: false),
                    TransactionJson = table.Column<string>(maxLength: 4000, nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    VoucherId = table.Column<Guid>(nullable: true),
                    PromotionId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transaction_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Username = table.Column<string>(unicode: false, maxLength: 25, nullable: false),
                    RoleId = table.Column<int>(nullable: false),
                    Password = table.Column<string>(unicode: false, maxLength: 60, nullable: false),
                    FirstName = table.Column<string>(maxLength: 50, nullable: false),
                    LastName = table.Column<string>(maxLength: 50, nullable: false),
                    PhoneNumber = table.Column<string>(unicode: false, maxLength: 12, nullable: false),
                    Email = table.Column<string>(unicode: false, maxLength: 62, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ImgUrl = table.Column<string>(unicode: false, maxLength: 2048, nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    BrandId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account_1", x => x.Username);
                    table.ForeignKey(
                        name: "FK_Account_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Account_Role",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ConditionGroup",
                columns: table => new
                {
                    ConditionGroupId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    ConditionRuleId = table.Column<Guid>(nullable: false),
                    GroupNo = table.Column<int>(nullable: false),
                    NextOperator = table.Column<int>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Summary = table.Column<string>(maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConditionGroup", x => x.ConditionGroupId);
                    table.ForeignKey(
                        name: "FK_ConditionGroup_ConditionRule",
                        column: x => x.ConditionRuleId,
                        principalTable: "ConditionRule",
                        principalColumn: "ConditionRuleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    ProductId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    ProductCateId = table.Column<Guid>(nullable: false),
                    Code = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    Name = table.Column<string>(maxLength: 80, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ProductType = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_Product_ProductCategory",
                        column: x => x.ProductCateId,
                        principalTable: "ProductCategory",
                        principalColumn: "ProductCateId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GameCampaign",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: false),
                    GameMasterId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    Quantity = table.Column<int>(nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    StartGame = table.Column<DateTime>(type: "datetime", nullable: true),
                    EndGame = table.Column<DateTime>(type: "datetime", nullable: true),
                    PromotionId = table.Column<Guid>(nullable: true),
                    SecretCode = table.Column<string>(unicode: false, maxLength: 6, nullable: true),
                    HasCode = table.Column<bool>(nullable: false),
                    ExpiredDuration = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameCampaign", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Game_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GameConfig_GameMaster",
                        column: x => x.GameMasterId,
                        principalTable: "GameMaster",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GameCampaign_Promotion",
                        column: x => x.PromotionId,
                        principalTable: "Promotion",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MemberLevelMapping",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    MemberLevelId = table.Column<Guid>(nullable: false),
                    PromotionId = table.Column<Guid>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberLevelMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MemberLevelMapping_MemberLevel",
                        column: x => x.MemberLevelId,
                        principalTable: "MemberLevel",
                        principalColumn: "MemberLevelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MemberLevelMapping_Promotion",
                        column: x => x.PromotionId,
                        principalTable: "Promotion",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PromotionChannelMapping",
                columns: table => new
                {
                    PromotionChannelId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    PromotionId = table.Column<Guid>(nullable: false),
                    ChannelId = table.Column<Guid>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoucherChannel", x => x.PromotionChannelId);
                    table.ForeignKey(
                        name: "FK_VoucherChannel_Channel",
                        column: x => x.ChannelId,
                        principalTable: "Channel",
                        principalColumn: "ChannelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PromotionChannelMapping_Promotion",
                        column: x => x.PromotionId,
                        principalTable: "Promotion",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Device",
                columns: table => new
                {
                    DeviceId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    StoreId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    Code = table.Column<string>(unicode: false, maxLength: 8, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Device", x => x.DeviceId);
                    table.ForeignKey(
                        name: "FK_Device_Store",
                        column: x => x.StoreId,
                        principalTable: "Store",
                        principalColumn: "StoreId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PromotionStoreMapping",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    StoreId = table.Column<Guid>(nullable: false),
                    PromotionId = table.Column<Guid>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionStoreMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PromotionStoreMapping_Promotion",
                        column: x => x.PromotionId,
                        principalTable: "Promotion",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PromotionStoreMapping_Store",
                        column: x => x.StoreId,
                        principalTable: "Store",
                        principalColumn: "StoreId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderCondition",
                columns: table => new
                {
                    OrderConditionId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    ConditionGroupId = table.Column<Guid>(nullable: false),
                    NextOperator = table.Column<int>(nullable: false),
                    IndexGroup = table.Column<int>(nullable: false),
                    Quantity = table.Column<int>(nullable: false),
                    QuantityOperator = table.Column<string>(unicode: false, maxLength: 2, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(10, 0)", nullable: false),
                    AmountOperator = table.Column<string>(unicode: false, maxLength: 2, nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderCondition", x => x.OrderConditionId);
                    table.ForeignKey(
                        name: "FK_OrderCondition_ConditionGroup1",
                        column: x => x.ConditionGroupId,
                        principalTable: "ConditionGroup",
                        principalColumn: "ConditionGroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProductCondition",
                columns: table => new
                {
                    ProductConditionId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    ConditionGroupId = table.Column<Guid>(nullable: false),
                    IndexGroup = table.Column<int>(nullable: false),
                    ProductConditionType = table.Column<int>(nullable: false),
                    ProductQuantity = table.Column<int>(nullable: false),
                    QuantityOperator = table.Column<string>(unicode: false, maxLength: 2, nullable: false),
                    NextOperator = table.Column<int>(nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCondition", x => x.ProductConditionId);
                    table.ForeignKey(
                        name: "FK_ProductCondition_ConditionGroup",
                        column: x => x.ConditionGroupId,
                        principalTable: "ConditionGroup",
                        principalColumn: "ConditionGroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ActionProductMapping",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ActionId = table.Column<Guid>(nullable: false),
                    ProductId = table.Column<Guid>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Quantity = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActionProductMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActionProductMapping_Action",
                        column: x => x.ActionId,
                        principalTable: "Action",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActionProductMapping_Product",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GameItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    PromotionTierId = table.Column<Guid>(nullable: false),
                    GameId = table.Column<Guid>(nullable: false),
                    Priority = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    DisplayText = table.Column<string>(maxLength: 30, nullable: false),
                    Description = table.Column<string>(maxLength: 4000, nullable: true),
                    ImgUrl = table.Column<string>(unicode: false, maxLength: 2048, nullable: true),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    TextColor = table.Column<string>(unicode: false, fixedLength: true, maxLength: 7, nullable: true),
                    ItemColor = table.Column<string>(unicode: false, fixedLength: true, maxLength: 7, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameItems_Game",
                        column: x => x.GameId,
                        principalTable: "GameCampaign",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Gift",
                columns: table => new
                {
                    GiftId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    PostActionType = table.Column<int>(nullable: false),
                    BonusPoint = table.Column<decimal>(type: "decimal(10, 2)", nullable: true),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    GiftVoucherGroupId = table.Column<Guid>(nullable: true),
                    Name = table.Column<string>(maxLength: 100, nullable: true),
                    BrandId = table.Column<Guid>(nullable: true),
                    GameCampaignId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gift", x => x.GiftId);
                    table.ForeignKey(
                        name: "FK_PostAction_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostAction_GameCampaign",
                        column: x => x.GameCampaignId,
                        principalTable: "GameCampaign",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StoreGameCampaignMapping",
                columns: table => new
                {
                    StoreGameCampaignId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    GameCampaignId = table.Column<Guid>(nullable: false),
                    StoreId = table.Column<Guid>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("StoreGameCampaignMapping_PK", x => x.StoreGameCampaignId);
                    table.ForeignKey(
                        name: "StoreGameCampaignMapping_FK_1",
                        column: x => x.GameCampaignId,
                        principalTable: "GameCampaign",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "StoreGameCampaignMapping_FK",
                        column: x => x.StoreId,
                        principalTable: "Store",
                        principalColumn: "StoreId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProductConditionMapping",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    ProductId = table.Column<Guid>(nullable: false),
                    ProductConditionId = table.Column<Guid>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductConditionMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductConditionMapping_ProductCondition",
                        column: x => x.ProductConditionId,
                        principalTable: "ProductCondition",
                        principalColumn: "ProductConditionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductConditionMapping_Product",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GiftProductMapping",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    GiftId = table.Column<Guid>(nullable: false),
                    ProductId = table.Column<Guid>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Quantity = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GiftProductMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostActionProductMapping_PostAction",
                        column: x => x.GiftId,
                        principalTable: "Gift",
                        principalColumn: "GiftId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostActionProductMapping_Product",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VoucherGroup",
                columns: table => new
                {
                    VoucherGroupId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    BrandId = table.Column<Guid>(nullable: false),
                    VoucherName = table.Column<string>(maxLength: 100, nullable: false),
                    Quantity = table.Column<int>(nullable: false),
                    UsedQuantity = table.Column<int>(nullable: false),
                    RedempedQuantity = table.Column<int>(nullable: false),
                    DelFlg = table.Column<bool>(nullable: false),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Charset = table.Column<string>(unicode: false, maxLength: 42, nullable: true),
                    Postfix = table.Column<string>(unicode: false, maxLength: 10, nullable: true),
                    Prefix = table.Column<string>(unicode: false, maxLength: 10, nullable: true),
                    CustomCharset = table.Column<string>(unicode: false, maxLength: 106, nullable: true),
                    ActionId = table.Column<Guid>(nullable: true),
                    GiftId = table.Column<Guid>(nullable: true),
                    CodeLength = table.Column<int>(nullable: true),
                    ImgUrl = table.Column<string>(unicode: false, maxLength: 2048, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoucherGroup", x => x.VoucherGroupId);
                    table.ForeignKey(
                        name: "FK_VoucherGroup_Action",
                        column: x => x.ActionId,
                        principalTable: "Action",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VoucherGroup_Brand",
                        column: x => x.BrandId,
                        principalTable: "Brand",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VoucherGroup_PostAction",
                        column: x => x.GiftId,
                        principalTable: "Gift",
                        principalColumn: "GiftId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PromotionTier",
                columns: table => new
                {
                    PromotionTierId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    ConditionRuleId = table.Column<Guid>(nullable: true),
                    ActionId = table.Column<Guid>(nullable: true),
                    PromotionId = table.Column<Guid>(nullable: true),
                    GiftId = table.Column<Guid>(nullable: true),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Summary = table.Column<string>(maxLength: 4000, nullable: true),
                    TierIndex = table.Column<int>(nullable: false),
                    VoucherGroupId = table.Column<Guid>(nullable: true),
                    Priority = table.Column<int>(nullable: true),
                    VoucherQuantity = table.Column<int>(nullable: true),
                    ProductCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionTier", x => x.PromotionTierId);
                    table.ForeignKey(
                        name: "FK_Action_PromotionTier",
                        column: x => x.ActionId,
                        principalTable: "Action",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PromotionTier_ConditionRule",
                        column: x => x.ConditionRuleId,
                        principalTable: "ConditionRule",
                        principalColumn: "ConditionRuleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "PromotionTier_FK",
                        column: x => x.GiftId,
                        principalTable: "Gift",
                        principalColumn: "GiftId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PromotionTier_Promotion",
                        column: x => x.PromotionId,
                        principalTable: "Promotion",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PromotionTier_VoucherGroup",
                        column: x => x.VoucherGroupId,
                        principalTable: "VoucherGroup",
                        principalColumn: "VoucherGroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Voucher",
                columns: table => new
                {
                    VoucherId = table.Column<Guid>(nullable: false, defaultValueSql: "(newid())"),
                    VoucherCode = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    ChannelId = table.Column<Guid>(nullable: true),
                    StoreId = table.Column<Guid>(nullable: true),
                    VoucherGroupId = table.Column<Guid>(nullable: false),
                    MembershipId = table.Column<Guid>(nullable: true),
                    IsUsed = table.Column<bool>(nullable: false),
                    IsRedemped = table.Column<bool>(nullable: false),
                    UsedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    RedempedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    InsDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    PromotionId = table.Column<Guid>(nullable: true),
                    Index = table.Column<int>(nullable: true),
                    GameCampaignId = table.Column<Guid>(nullable: true),
                    PromotionTierId = table.Column<Guid>(nullable: true),
                    OrderId = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    TransactionId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Voucher_1", x => new { x.VoucherId, x.VoucherCode });
                    table.ForeignKey(
                        name: "FK_Voucher_Channel",
                        column: x => x.ChannelId,
                        principalTable: "Channel",
                        principalColumn: "ChannelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Voucher_GameCampaign",
                        column: x => x.GameCampaignId,
                        principalTable: "GameCampaign",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Voucher_Membership",
                        column: x => x.MembershipId,
                        principalTable: "Membership",
                        principalColumn: "MembershipId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Voucher_Promotion",
                        column: x => x.PromotionId,
                        principalTable: "Promotion",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Voucher_Store",
                        column: x => x.StoreId,
                        principalTable: "Store",
                        principalColumn: "StoreId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Voucher_VoucherGroup",
                        column: x => x.VoucherGroupId,
                        principalTable: "VoucherGroup",
                        principalColumn: "VoucherGroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_BrandId",
                table: "Account",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Account_RoleId",
                table: "Account",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Action_BrandId",
                table: "Action",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_ActionProductMapping_ActionId",
                table: "ActionProductMapping",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_ActionProductMapping_ProductId",
                table: "ActionProductMapping",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "Brand_UN",
                table: "Brand",
                column: "BrandCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Channel_BrandId",
                table: "Channel",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_ConditionGroup_ConditionRuleId",
                table: "ConditionGroup",
                column: "ConditionRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ConditionRule_BrandId",
                table: "ConditionRule",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Device_StoreId",
                table: "Device",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_GameCampaign_BrandId",
                table: "GameCampaign",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_GameCampaign_GameMasterId",
                table: "GameCampaign",
                column: "GameMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_GameCampaign_PromotionId",
                table: "GameCampaign",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_GameItems_GameId",
                table: "GameItems",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Gift_BrandId",
                table: "Gift",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Gift_GameCampaignId",
                table: "Gift",
                column: "GameCampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_GiftProductMapping_GiftId",
                table: "GiftProductMapping",
                column: "GiftId");

            migrationBuilder.CreateIndex(
                name: "IX_GiftProductMapping_ProductId",
                table: "GiftProductMapping",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_MemberLevel_BrandId",
                table: "MemberLevel",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_MemberLevelMapping_MemberLevelId",
                table: "MemberLevelMapping",
                column: "MemberLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_MemberLevelMapping_PromotionId",
                table: "MemberLevelMapping",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderCondition_ConditionGroupId",
                table: "OrderCondition",
                column: "ConditionGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_ProductCateId",
                table: "Product",
                column: "ProductCateId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategory_BrandId",
                table: "ProductCategory",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCondition_ConditionGroupId",
                table: "ProductCondition",
                column: "ConditionGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductConditionMapping_ProductConditionId",
                table: "ProductConditionMapping",
                column: "ProductConditionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductConditionMapping_ProductId",
                table: "ProductConditionMapping",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_BrandId",
                table: "Promotion",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionChannelMapping_ChannelId",
                table: "PromotionChannelMapping",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionChannelMapping_PromotionId",
                table: "PromotionChannelMapping",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionStoreMapping_PromotionId",
                table: "PromotionStoreMapping",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionStoreMapping_StoreId",
                table: "PromotionStoreMapping",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionTier_ActionId",
                table: "PromotionTier",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionTier_ConditionRuleId",
                table: "PromotionTier",
                column: "ConditionRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionTier_GiftId",
                table: "PromotionTier",
                column: "GiftId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionTier_PromotionId",
                table: "PromotionTier",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionTier_VoucherGroupId",
                table: "PromotionTier",
                column: "VoucherGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Store_BrandId",
                table: "Store",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_StoreGameCampaignMapping_GameCampaignId",
                table: "StoreGameCampaignMapping",
                column: "GameCampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_StoreGameCampaignMapping_StoreId",
                table: "StoreGameCampaignMapping",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_BrandId",
                table: "Transaction",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_ChannelId",
                table: "Voucher",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_GameCampaignId",
                table: "Voucher",
                column: "GameCampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_MembershipId",
                table: "Voucher",
                column: "MembershipId");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_PromotionId",
                table: "Voucher",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_StoreId",
                table: "Voucher",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_VoucherGroupId",
                table: "Voucher",
                column: "VoucherGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherGroup_ActionId",
                table: "VoucherGroup",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherGroup_BrandId",
                table: "VoucherGroup",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherGroup_GiftId",
                table: "VoucherGroup",
                column: "GiftId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "ActionProductMapping");

            migrationBuilder.DropTable(
                name: "Device");

            migrationBuilder.DropTable(
                name: "GameItems");

            migrationBuilder.DropTable(
                name: "GiftProductMapping");

            migrationBuilder.DropTable(
                name: "MemberLevelMapping");

            migrationBuilder.DropTable(
                name: "OrderCondition");

            migrationBuilder.DropTable(
                name: "ProductConditionMapping");

            migrationBuilder.DropTable(
                name: "PromotionChannelMapping");

            migrationBuilder.DropTable(
                name: "PromotionStoreMapping");

            migrationBuilder.DropTable(
                name: "PromotionTier");

            migrationBuilder.DropTable(
                name: "StoreGameCampaignMapping");

            migrationBuilder.DropTable(
                name: "Transaction");

            migrationBuilder.DropTable(
                name: "Voucher");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "MemberLevel");

            migrationBuilder.DropTable(
                name: "ProductCondition");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "Channel");

            migrationBuilder.DropTable(
                name: "Membership");

            migrationBuilder.DropTable(
                name: "Store");

            migrationBuilder.DropTable(
                name: "VoucherGroup");

            migrationBuilder.DropTable(
                name: "ConditionGroup");

            migrationBuilder.DropTable(
                name: "ProductCategory");

            migrationBuilder.DropTable(
                name: "Action");

            migrationBuilder.DropTable(
                name: "Gift");

            migrationBuilder.DropTable(
                name: "ConditionRule");

            migrationBuilder.DropTable(
                name: "GameCampaign");

            migrationBuilder.DropTable(
                name: "GameMaster");

            migrationBuilder.DropTable(
                name: "Promotion");

            migrationBuilder.DropTable(
                name: "Brand");
        }
    }
}
