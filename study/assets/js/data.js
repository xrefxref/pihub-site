/* ============================================================
   Seed data — 深规院考察助手
   字段对齐原 Supabase 表：Project / StudyPlan
   坐标为内置兜底（真实大模型可覆盖增强）
   ============================================================ */

/* 考察主题（原版固定列表） */
const THEMES = [
  "滨海空间", "城市更新", "历史保护", "公园绿地", "交通枢纽",
  "超高层建筑", "公共住房", "产业园区", "智慧城市", "文化设施",
  "教育设施", "医疗设施"
];

/* 省市区三级联动数据（节选） */
const REGIONS = [
  { name: "广东省", children: [
    { name: "深圳市", children: [
      { name: "福田区" }, { name: "罗湖区" }, { name: "南山区" },
      { name: "宝安区" }, { name: "龙岗区" }, { name: "龙华区" },
      { name: "坪山区" }, { name: "光明区" }, { name: "大鹏新区" }
    ]},
    { name: "广州市", children: [
      { name: "越秀区" }, { name: "天河区" }, { name: "海珠区" }, { name: "荔湾区" }
    ]},
    { name: "东莞市", children: [ { name: "莞城街道" }, { name: "南城街道" } ]},
    { name: "佛山市", children: [ { name: "禅城区" }, { name: "南海区" } ]}
  ]},
  { name: "北京市", children: [
    { name: "西城区" }, { name: "朝阳区" }, { name: "海淀区" }, { name: "丰台区" }
  ]},
  { name: "上海市", children: [
    { name: "浦东新区" }, { name: "黄浦区" }, { name: "徐汇区" }, { name: "静安区" }
  ]},
  { name: "江苏省", children: [ { name: "南京市", children: [
    { name: "鼓楼区" }, { name: "建邺区" }, { name: "江宁区" }
  ]}]},
  { name: "四川省", children: [ { name: "成都市", children: [
    { name: "锦江区" }, { name: "武侯区" }, { name: "高新区" }
  ]}]},
  { name: "福建省", children: [ { name: "福州市", children: [
    { name: "鼓楼区" }, { name: "台江区" }
  ]}]},
  { name: "湖北省", children: [ { name: "武汉市", children: [
    { name: "江汉区" }, { name: "武昌区" }
  ]}]},
  { name: "河北省", children: [ { name: "石家庄市", children: [
    { name: "长安区" }, { name: "桥西区" }
  ]}]},
  { name: "甘肃省", children: [ { name: "兰州市", children: [
    { name: "城关区" }, { name: "七里河区" }
  ]}]}
];

/* 区域坐标兜底（原版由 AI 联网获取，这里内置以保证离线可用） */
const DISTRICT_COORDS = {
  "福田区": [22.5415, 114.0583], "罗湖区": [22.5559, 114.1234],
  "南山区": [22.5316, 113.9305], "宝安区": [22.5559, 113.8831],
  "龙岗区": [22.7229, 114.2133], "龙华区": [22.6625, 114.0383],
  "坪山区": [22.6929, 114.3333], "光明区": [22.7529, 113.9144],
  "大鹏新区": [22.5636, 114.5011],
  "越秀区": [23.1284, 113.2671], "天河区": [23.1247, 113.3614],
  "海珠区": [23.0838, 113.3170], "荔湾区": [23.1250, 113.2440],
  "莞城街道": [23.0207, 113.7518], "南城街道": [22.9990, 113.7530],
  "禅城区": [23.0210, 113.1210], "南海区": [23.0530, 113.1530],
  "西城区": [39.9151, 116.366], "朝阳区": [39.9219, 116.4431],
  "海淀区": [39.9599, 116.2981], "丰台区": [39.8585, 116.2867],
  "浦东新区": [31.2218, 121.5446], "黄浦区": [31.2304, 121.4737],
  "徐汇区": [31.1880, 121.4370], "静安区": [31.2290, 121.4486],
  "鼓楼区": [32.0617, 118.7771], "建邺区": [32.0280, 118.7160],
  "江宁区": [31.9530, 118.8280],
  "锦江区": [30.6570, 104.0900], "武侯区": [30.6420, 104.0430], "高新区": [30.5720, 104.0660],
  "鼓楼区2": [26.0740, 119.2960], "台江区": [26.0670, 119.3100],
  "江汉区": [30.6060, 114.2680], "武昌区": [30.5480, 114.3050],
  "长安区": [38.0420, 114.5140], "桥西区": [38.0480, 114.4700],
  "城关区": [36.0610, 103.8340], "七里河区": [36.0650, 103.7780]
};

/* 项目种子（深规院风格，示意数据） */
const PROJECTS = [
  {
    id: "p01", name: "深圳市建设儿童友好型城市系列规划",
    province: "广东省", city: "深圳市", district: "福田区",
    address: "福田区妇儿大厦周边片区",
    description: "构建儿童友好型城市规划体系，首创儿童友好型城市规划标准，打造儿童友好型公共空间。",
    themes: ["公园绿地", "公共住房", "教育设施"],
    mainContent: "通过构建儿童友好型城市规划体系，推动公共空间适儿化改造，形成可复制的街区尺度营造范式。",
    coreValue: "首创儿童友好型城市规划标准，公共空间设计范式的系统性突破。",
    specificPoint: "福田区妇儿大厦周边片区（坐标：22.5415°N 114.0583°E）",
    imageUrl: null, lat: 22.5415, lng: 114.0583, year: 2021, award: "国家级"
  },
  {
    id: "p02", name: "深圳湾超级总部基地城市设计",
    province: "广东省", city: "深圳市", district: "南山区",
    address: "南山区深圳湾畔（白石洲—红树湾段）",
    description: "面向湾区的超级总部集聚区，高强度开发下的立体城市与滨海公共空间融合。",
    themes: ["超高层建筑", "滨海空间", "智慧城市"],
    mainContent: "以 TOD 与滨海廊道组织超高层集群，构建上下贯通的立体公共活动网络。",
    coreValue: "湾区级总部集聚与滨海公共生活融合的标杆范式。",
    specificPoint: "南山区深圳湾畔滨海长廊",
    imageUrl: null, lat: 22.5316, lng: 113.9305, year: 2019, award: "国际级"
  },
  {
    id: "p03", name: "前海蛇口自贸区城市设计",
    province: "广东省", city: "深圳市", district: "南山区",
    address: "南山区前海深港合作区",
    description: "深港现代服务业合作区，水城中轴与高密度混合功能组织。",
    themes: ["城市更新", "滨海空间", "TOD开发"],
    mainContent: "以水城中轴串联多元功能，强调小街区、密路网与轨道站点一体化。",
    coreValue: "新城中心区规划治理与实施机制的创新样本。",
    specificPoint: "前湾片区水城中轴",
    imageUrl: null, lat: 22.5300, lng: 113.8950, year: 2018, award: "国家级"
  },
  {
    id: "p04", name: "福田中心区公共空间优化提升",
    province: "广东省", city: "深圳市", district: "福田区",
    address: "福田区中心公园—市民中心周边",
    description: "超大城市中心区公共空间精细化与慢行系统重构。",
    themes: ["公园绿地", "城市更新", "文化设施"],
    mainContent: "以市民中心—中心公园为核心，重塑轴线连续性与全龄友好活动场景。",
    coreValue: "中心区存量空间品质提升与精细化治理实践。",
    specificPoint: "中心公园北广场",
    imageUrl: null, lat: 22.5460, lng: 114.0580, year: 2020, award: "省级"
  },
  {
    id: "p05", name: "罗湖火车站周边城市更新",
    province: "广东省", city: "深圳市", district: "罗湖区",
    address: "罗湖区罗湖口岸—火车站片区",
    description: "口岸门户地区功能置换与空间品质再生。",
    themes: ["城市更新", "交通枢纽", "TOD开发"],
    mainContent: "围绕高铁与口岸枢纽，推动站城一体与低效用地再开发。",
    coreValue: "老城区枢纽门户存量更新的实施路径探索。",
    specificPoint: "罗湖口岸交通枢纽",
    imageUrl: null, lat: 22.5559, lng: 114.1234, year: 2017, award: null
  },
  {
    id: "p06", name: "龙岗大运新城规划",
    province: "广东省", city: "深圳市", district: "龙岗区",
    address: "龙岗区大运新城核心区",
    description: "以国际大学园为引擎的东部城市副中心。",
    themes: ["教育设施", "产业园区", "公园绿地"],
    mainContent: "依托高校与体育枢纽，构建产学研城融合的新城空间结构。",
    coreValue: "东部地区产城融合与公共中心建设的示范。",
    specificPoint: "大运中心周边",
    imageUrl: null, lat: 22.7229, lng: 114.2133, year: 2016, award: "国家级"
  },
  {
    id: "p07", name: "宝安国际机场周边临空经济区规划",
    province: "广东省", city: "深圳市", district: "宝安区",
    address: "宝安区宝安国际机场东侧",
    description: "临空经济与综合交通枢纽协同的空间组织。",
    themes: ["交通枢纽", "产业园区", "智慧城市"],
    mainContent: "以机场枢纽为核，组织会展、物流与先进制造等功能簇群。",
    coreValue: "空港—产业—城市协同发展的区域引擎设计。",
    specificPoint: "机场东侧临空产业带",
    imageUrl: null, lat: 22.5559, lng: 113.8831, year: 2019, award: null
  },
  {
    id: "p08", name: "龙华深圳北站枢纽地区城市设计",
    province: "广东省", city: "深圳市", district: "龙华区",
    address: "龙华区深圳北站周边",
    description: "高铁门户地区的站城一体与高强度开发。",
    themes: ["交通枢纽", "超高层建筑", "TOD开发"],
    mainContent: "围绕高铁枢纽构建垂直混合与立体步行网络，塑造城市新门户。",
    coreValue: "高铁新城站城一体开发的标准化范式。",
    specificPoint: "深圳北站东广场",
    imageUrl: null, lat: 22.6625, lng: 114.0383, year: 2018, award: "省级"
  },
  {
    id: "p09", name: "光明科学城规划",
    province: "广东省", city: "深圳市", district: "光明区",
    address: "光明区公常路以北科学装置集聚区",
    description: "综合性国家科学中心承载区的空间布局。",
    themes: ["产业园区", "公园绿地", "智慧城市"],
    mainContent: "以重大科技基础设施为锚，组织研发、居住与生态融合的科创新城。",
    coreValue: "科学城尺度下产研居生态一体的规划创新。",
    specificPoint: "光明科学城核心区",
    imageUrl: null, lat: 22.7529, lng: 113.9144, year: 2020, award: "国家级"
  },
  {
    id: "p10", name: "坪山中心区及文化聚落规划",
    province: "广东省", city: "深圳市", district: "坪山区",
    address: "坪山区中心区—文化聚落片区",
    description: "东部文化中心与公共生活集聚区的营造。",
    themes: ["文化设施", "公园绿地", "城市更新"],
    mainContent: "以文化场馆群为触媒，激活中心区公共活力与文化消费。",
    coreValue: "文化驱动型新城中心营造的在地实践。",
    specificPoint: "坪山文化聚落",
    imageUrl: null, lat: 22.6929, lng: 114.3333, year: 2021, award: null
  },
  {
    id: "p11", name: "大鹏新区生态保护与文旅规划",
    province: "广东省", city: "深圳市", district: "大鹏新区",
    address: "大鹏新区东西涌—较场尾海岸带",
    description: "生态优先的海岸带保护与文旅适度开发。",
    themes: ["滨海空间", "历史保护", "公园绿地"],
    mainContent: "在严格的生态底线约束下，组织海岸游径与村落活化。",
    coreValue: "生态敏感地区保护与发展的平衡范式。",
    specificPoint: "较场尾—东西涌海岸",
    imageUrl: null, lat: 22.5636, lng: 114.5011, year: 2019, award: "省级"
  },
  {
    id: "p12", name: "广州恩宁路永庆坊微改造",
    province: "广东省", city: "广州市", district: "荔湾区",
    address: "广州市荔湾区恩宁路永庆坊",
    description: "历史文化街区“微改造”而非大拆大建的经典案例。",
    themes: ["历史保护", "城市更新", "文化设施"],
    mainContent: "以绣花功夫修复骑楼街巷，植入文创与社区生活功能。",
    coreValue: "历史文化街区活化与社区微改造的全国样本。",
    specificPoint: "永庆坊一期街区",
    imageUrl: null, lat: 23.1250, lng: 113.2440, year: 2016, award: "国家级"
  },
  {
    id: "p13", name: "成都锦江公园滨水空间规划",
    province: "四川省", city: "成都市", district: "锦江区",
    address: "成都市锦江区锦江两岸",
    description: "滨水公共空间连续化与城市生活方式重塑。",
    themes: ["滨海空间", "公园绿地", "文化设施"],
    mainContent: "贯通锦江两岸慢行网络，打造可游可憩的滨水生活画卷。",
    coreValue: "大城市滨水公共空间系统治理的标杆。",
    specificPoint: "锦江绿道示范段",
    imageUrl: null, lat: 30.6570, lng: 104.0900, year: 2020, award: "省级"
  },
  {
    id: "p14", name: "上海黄浦江两岸公共空间贯通设计",
    province: "上海市", city: "上海市", district: "黄浦区",
    address: "上海市黄浦区外滩—滨江段",
    description: "世界级滨水公共空间的生产性岸线转型。",
    themes: ["滨海空间", "城市更新", "文化设施"],
    mainContent: "将工业生产性岸线转化为连续开放的市民滨水长廊。",
    coreValue: "滨水工业遗产转型与公共性回归的典范。",
    specificPoint: "外滩滨江步道",
    imageUrl: null, lat: 31.2304, lng: 121.4737, year: 2017, award: "国际级"
  }
];

window.APP_DATA = { THEMES, REGIONS, DISTRICT_COORDS, PROJECTS };
