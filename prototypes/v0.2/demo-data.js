/* Generated from demo/testicular-demo.json. Synthetic records only. */
window.TESTI_DEMO = {
  "today": "2026-11-16",
  "profiles": [
    {
      "id": "demo-a",
      "name": "陈屿 · 合成演示",
      "tag": "刚确诊 · 记录较少",
      "summary": "刚完成手术，正在收集病理、标志物和生育力保存相关记录。",
      "facts": [
        {
          "label": "手术记录",
          "value": "左侧根治性睾丸切除术",
          "date": "2026-10-28",
          "source": "合成示例病历"
        },
        {
          "label": "病理原话",
          "value": "报告原文待补充",
          "date": "2026-11-03",
          "source": "尚未登记原件"
        }
      ],
      "labs": [
        {
          "id": "a-afp-1",
          "key": "AFP",
          "label": "AFP",
          "value": 5.8,
          "unit": "ng/mL",
          "date": "2026-10-27",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 A-01"
        },
        {
          "id": "a-afp-2",
          "key": "AFP",
          "label": "AFP",
          "value": 4.9,
          "unit": "ng/mL",
          "date": "2026-11-03",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 A-02"
        },
        {
          "id": "a-hcg-1",
          "key": "β-hCG",
          "label": "β-hCG",
          "value": 7.2,
          "unit": "mIU/mL",
          "date": "2026-10-27",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 A-01"
        },
        {
          "id": "a-hcg-2",
          "key": "β-hCG",
          "label": "β-hCG",
          "value": 3.4,
          "unit": "mIU/mL",
          "date": "2026-11-03",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 A-02"
        },
        {
          "id": "a-ldh-1",
          "key": "LDH",
          "label": "LDH",
          "value": 192,
          "unit": "U/L",
          "date": "2026-10-27",
          "method": "速率法",
          "org": "市立医院检验科",
          "source": "合成报告 A-01"
        },
        {
          "id": "a-ldh-2",
          "key": "LDH",
          "label": "LDH",
          "value": 187,
          "unit": "U/L",
          "date": "2026-11-03",
          "method": "速率法",
          "org": "市立医院检验科",
          "source": "合成报告 A-02"
        }
      ],
      "nodes": [
        {
          "name": "术后标志物复查",
          "date": "2026-11-03",
          "status": "done",
          "quote": "医生方案原话尚未录入",
          "source": "合成示例"
        },
        {
          "name": "复诊并核对病理报告",
          "date": "2026-11-20",
          "status": "planned",
          "quote": "按门诊医生安排",
          "source": "患者自填"
        }
      ],
      "fertility": {
        "status": "未记录",
        "institution": "",
        "date": "",
        "note": "可记录咨询、保存、暂缓或未进行；本台不提供医学建议。"
      },
      "questions": [
        "病理报告里需要重点核对哪些原文？",
        "下一次复查项目和日期如何安排？"
      ],
      "notes": [
        {
          "text": "等报告时有点紧张，想把要问的问题先记下来。",
          "private": true,
          "date": "2026-11-04"
        }
      ],
      "events": [
        {
          "date": "2026-10-28",
          "label": "手术记录",
          "type": "procedure",
          "id": "demo-a-event-1"
        }
      ],
      "studyCount": 9
    },
    {
      "id": "demo-b",
      "name": "周航 · 合成演示",
      "tag": "长期随访 · 记录较多",
      "summary": "已记录多个随访时间点、影像登记和周期信息，适合检查跨页联动。",
      "facts": [
        {
          "label": "手术记录",
          "value": "右侧根治性睾丸切除术",
          "date": "2024-03-11",
          "source": "合成示例病历"
        },
        {
          "label": "病理原话",
          "value": "精原细胞瘤（合成演示文本）",
          "date": "2024-03-19",
          "source": "合成示例报告 B-01"
        }
      ],
      "labs": [
        {
          "id": "b-afp-1",
          "key": "AFP",
          "label": "AFP",
          "value": 4.2,
          "unit": "ng/mL",
          "date": "2024-03-19",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 B-01"
        },
        {
          "id": "b-afp-2",
          "key": "AFP",
          "label": "AFP",
          "value": 4.5,
          "unit": "ng/mL",
          "date": "2024-05-12",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 B-02"
        },
        {
          "id": "b-afp-3",
          "key": "AFP",
          "value": 4.1,
          "unit": "ng/mL",
          "date": "2025-01-16",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 B-03"
        },
        {
          "id": "b-afp-4",
          "key": "AFP",
          "value": 4.3,
          "unit": "ng/mL",
          "date": "2026-10-28",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 B-04"
        },
        {
          "id": "b-hcg-1",
          "key": "β-hCG",
          "value": 1.2,
          "unit": "mIU/mL",
          "date": "2024-03-19",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 B-01"
        },
        {
          "id": "b-hcg-2",
          "key": "β-hCG",
          "value": 1,
          "unit": "mIU/mL",
          "date": "2025-01-16",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 B-03"
        },
        {
          "id": "b-hcg-3",
          "key": "β-hCG",
          "value": 1.1,
          "unit": "mIU/mL",
          "date": "2026-10-28",
          "method": "化学发光",
          "org": "市立医院检验科",
          "source": "合成报告 B-04"
        },
        {
          "id": "b-ldh-1",
          "key": "LDH",
          "value": 205,
          "unit": "U/L",
          "date": "2024-03-19",
          "method": "速率法",
          "org": "市立医院检验科",
          "source": "合成报告 B-01"
        },
        {
          "id": "b-ldh-2",
          "key": "LDH",
          "value": 188,
          "unit": "U/L",
          "date": "2025-01-16",
          "method": "速率法",
          "org": "市立医院检验科",
          "source": "合成报告 B-03"
        },
        {
          "id": "b-ldh-3",
          "key": "LDH",
          "value": 196,
          "unit": "U/L",
          "date": "2026-10-28",
          "method": "速率法",
          "org": "市立医院检验科",
          "source": "合成报告 B-04"
        }
      ],
      "nodes": [
        {
          "name": "门诊复查与标志物",
          "date": "2026-10-28",
          "status": "done",
          "quote": "每次复查按门诊医生给出的安排执行。",
          "source": "合成示例方案原话"
        },
        {
          "name": "影像检查记录",
          "date": "2026-11-28",
          "status": "planned",
          "quote": "下次检查日期以预约信息为准。",
          "source": "合成示例"
        }
      ],
      "fertility": {
        "status": "已咨询",
        "institution": "市生殖医学中心（合成）",
        "date": "2024-02-28",
        "note": "这里只记录个人过程，不展示医学判断。"
      },
      "questions": [
        "下一次复诊需要携带哪些资料？"
      ],
      "notes": [
        {
          "text": "复诊前把影像报告和问题清单放在一起。",
          "private": false,
          "date": "2026-10-28"
        },
        {
          "text": "不想在导出材料里出现的个人感受。",
          "private": true,
          "date": "2026-10-30"
        }
      ],
      "events": [
        {
          "date": "2024-03-11",
          "label": "手术记录",
          "type": "procedure",
          "id": "demo-b-event-1"
        },
        {
          "date": "2025-04-02",
          "label": "治疗周期记录",
          "type": "course",
          "id": "demo-b-event-2"
        }
      ],
      "studyCount": 9
    }
  ],
  "sources": {
    "trials": "research/testicular/manifest.json",
    "snapshotDate": "2026-11-18",
    "snapshotCount": 9,
    "channelStates": {
      "chinadrugtrials": "9 条（睾丸癌查询返回；相关性未逐条审核）",
      "ctv": "FAILED",
      "ictrp": "FAILED",
      "chictr_online": "FAILED",
      "chictr_pancreatic_archive": "NEEDS_SETUP（胰腺癌语料，不覆盖睾丸癌）",
      "xyb_chinadrugtrials_archive": "NEEDS_SETUP"
    }
  }
};
