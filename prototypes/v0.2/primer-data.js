/* 疾病概要：解释层；只引用已检查的公开入口并明确原件状态。访问日期 2026-11-16。 */
window.DISEASE_PRIMER = {
  brand: '小勇宝 TestiPal',
  name: '睾丸癌',
  en: 'Testicular Cancer',
  updated: '2026-11-16',
  sections: [
    {
      id: 'definition', title: '定义',
      intro: '睾丸癌是发生于睾丸的恶性肿瘤。美国国家癌症研究所（NCI）资料说明，多数睾丸癌属于生殖细胞肿瘤；资料按精原细胞瘤与非精原细胞瘤分类介绍。该概述不用于判断个人病理或分期。',
      points: ['本工作台只记录病理报告与医生原话，不自动分类或计算分期。'],
      sources: [{ org:'NCI', doc:'Testicular Cancer—Health Professional Version', version:'在线资料；访问 2026-11-16', original:false, secondaryUrl:'https://www.cancer.gov/types/testicular/hp', note:'网页综述，不是本项目取得的指南原件；页码不适用。' }]
    },
    {
      id: 'evidence', title: '医学资料规范和指南情况',
      intro: 'NCCN 提供 Testicular Cancer 专业指南入口，完整专业版须按其访问要求取得。本项目本轮没有取得 NCCN 原件，不引述具体条文。NCI PDQ 患者版是公开的患者教育网页，不等同于指南。',
      table: {
        head:['机构','文件/资料','版本或日期','原件状态','本工作台用途'],
        rows:[
          ['NCCN','Testicular Cancer Guidelines','版本待核',{text:'官方 PDF 入口；需自行注册，原件未取得',kind:'hub',url:'https://www.nccn.org/professionals/physician_gls/pdf/testicular.pdf',note:'本环境未取得 PDF 原件，版本与页码待核。'},'待取得原件后核对，不转为个人建议'],
          ['NCI','Testicular Cancer Treatment','网页更新 2023-05-17',{text:'公开患者教育网页',kind:'hub',url:'https://www.cancer.gov/types/testicular/treatment',note:'网页资料，不是 NCCN/AUA 指南原件。'},'一般信息来源；不替代临床指南']
        ]
      },
      points:['患者访谈与临床审核均尚未完成。各指南版本、适用范围与本地规范需进一步核实。'],
      sources:[
        {org:'NCCN',doc:'Testicular Cancer Guidelines 官方入口',version:'访问 2026-11-16；版本待核',entry:true,url:'https://www.nccn.org/professionals/physician_gls/pdf/testicular.pdf',note:'需自行注册；本项目未取得原件，页码待核。'},
        {org:'NCI',doc:'Testicular Cancer Treatment',version:'页面标注更新 2023-05-17；访问 2026-11-16',original:false,secondaryUrl:'https://www.cancer.gov/types/testicular/treatment',note:'公开患者教育页面，不是治疗指南原件。'}
      ]
    },
    {
      id:'landscape',title:'目前治疗全景概要',
      intro:'NCI 患者教育页面列有手术、放射治疗、化学治疗与主动监测等类别，并另设临床研究信息。此处仅说明公开资料覆盖的类别；本工作台不根据病情选择、排序或比较。',
      groups:[
        {label:'治疗资料类别',points:['手术、放射治疗、化学治疗、主动监测。','不同病程中的适用情形须由医疗团队根据个人资料讨论；本工作台不作映射或选择。']},
        {label:'研究资料',points:['NCI 患者教育页面提供临床研究信息入口；本机快照另有检索通道状态，见「临床研究」。']}
      ],
      points:['以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。'],
      sources:[{org:'NCI',doc:'Testicular Cancer Treatment（患者教育页面）',version:'页面更新 2023-05-17；访问 2026-11-16',original:false,secondaryUrl:'https://www.cancer.gov/types/testicular/treatment',note:'依据公开患者教育网页；NCCN 指南原件未取得，页码待核。'}]
    },
    {
      id:'trend',title:'发展趋势',
      intro:'截至 2026-11-16，本轮没有核实到可写入的 NCCN 指南版本更替、监管批件或指南结构变化事实；因此不作趋势推测。',
      points:['本机研究快照于 2026-11-14 保存 235 条搜索返回记录。其疾病相关性尚未逐条核实，且若干在线通道为 FAILED；该数量不代表睾丸癌相关试验数或检索覆盖完整度。','NCI 患者教育页面标注最近更新日期为 2023-05-17；本轮访问时页面仍可查看。页面更新时间不代表指南版本变化。'],
      sources:[
        {org:'本机检索快照',doc:'research/testicular/manifest.json',version:'2026-11-14；访问 2026-11-16',nolink:true,note:'本仓本机文件；检索返回数 235，疾病相关性未逐条复核；部分通道 FAILED。'},
        {org:'NCI',doc:'Testicular Cancer Treatment',version:'页面更新 2023-05-17；访问 2026-11-16',original:false,secondaryUrl:'https://www.cancer.gov/types/testicular/treatment',note:'网页所列更新时间。'}
      ]
    }
  ]
};
