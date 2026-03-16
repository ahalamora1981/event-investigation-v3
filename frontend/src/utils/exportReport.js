import { format } from 'date-fns';

export function generateHTMLContent(events, filters, caseNumber, t, getChannelLabel) {
  const now = new Date();
  const timestamp = format(now, 'yyyy-MM-dd HH:mm:ss');
  
  const riskCounts = {
    high: events.filter(e => e.risk === 'high').length,
    medium: events.filter(e => e.risk === 'medium').length,
    low: events.filter(e => e.risk === 'low').length,
  };

  const filterConditionsItems = [];
  
  if (filters.tradeNumber) {
    filterConditionsItems.push(`<li><strong>${t('header.report.tradeNumber')}:</strong> ${filters.tradeNumber}</li>`);
  }
  
  const riskLevelLabels = filters.riskLevels.map(level => t(`riskLevels.${level}`));
  filterConditionsItems.push(`<li><strong>${t('header.report.riskLevels')}:</strong> ${riskLevelLabels.join(', ') || t('header.report.none')}</li>`);
  
  filterConditionsItems.push(`<li><strong>${t('header.report.correlationThreshold')}:</strong> ${filters.scoreThreshold}${t('header.report.pointsAbove') || '分以上'}</li>`);
  
  const channelLabels = filters.channels.map(ch => getChannelLabel(ch));
  filterConditionsItems.push(`<li><strong>${t('header.report.channels')}:</strong> ${channelLabels.length === filters.channels.length ? t('header.report.allChannels') : channelLabels.join(', ') || t('header.report.none')}</li>`);

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  const eventsHTML = sortedEvents.map((event, index) => {
    const dateObj = new Date(event.timestamp);
    const dateStr = format(dateObj, 'yyyy-MM-dd HH:mm:ss');
    const channelLabel = getChannelLabel(event.channel);
    const riskLabel = t(`riskLevels.${event.risk}`);
    
    let riskColor = '#dc2626';
    if (event.risk === 'medium') riskColor = '#d97706';
    if (event.risk === 'low') riskColor = '#059669';
    
    const indicatorItems = event.indicators && event.indicators.length > 0
      ? event.indicators.map(ind => `<span class="indicator">${ind.label}</span>`).join('')
      : `<span class="indicator-none">${t('header.report.none')}</span>`;

    return `
      <div class="record">
        <div class="record-header">
          <h3 class="record-title">${t('header.report.record')} ${index + 1} - <span style="color: ${riskColor}">${riskLabel}</span></h3>
        </div>
        <div class="record-content">
          <p><strong>${t('header.report.time')}:</strong> ${dateStr}</p>
          <p><strong>${t('header.report.channel')}:</strong> ${channelLabel}</p>
          <p><strong>${t('header.report.subject')}:</strong> ${event.subject}</p>
          <p><strong>${t('header.report.participants')}:</strong> ${event.participants.from} → ${event.participants.to}</p>
          <p><strong>${t('header.report.correlationScore')}:</strong> ${event.totalScore || 0}${t('timeline.correlationScoreUnit') || '分'}</p>
          <p><strong>${t('header.report.riskIndicators')}:</strong> ${indicatorItems}</p>
          <div class="content-section">
            <p class="content-label"><strong>${t('header.report.communicationContent')}:</strong></p>
            <pre class="content-text">${escapeHtml(event.content)}</pre>
          </div>
        </div>
      </div>
      <hr class="record-separator" />
    `;
  }).join('');

  const noEventsHTML = events.length === 0 
    ? `<p class="no-events"><em>${t('timeline.noEvents')}</em></p>` 
    : '';

  const content = `
    <div class="report-container">
      <h1>${t('header.report.title')}</h1>
      
      <div class="section">
        <h2>${t('header.report.caseInfo')}</h2>
        <ul>
          <li><strong>${t('header.report.caseNumber')}:</strong> ${caseNumber}</li>
          <li><strong>${t('header.report.exportTime')}:</strong> ${timestamp}</li>
        </ul>
      </div>
      
      <div class="section">
        <h2>${t('header.report.filterConditions')}</h2>
        <ul>
          ${filterConditionsItems.join('')}
        </ul>
      </div>
      
      <div class="section">
        <h2>${t('header.report.summary')}</h2>
        <div class="stats-grid">
          <div class="stat-card high">
            <div class="stat-value">${riskCounts.high}</div>
            <div class="stat-label">${t('header.report.highRiskCount')}</div>
          </div>
          <div class="stat-card medium">
            <div class="stat-value">${riskCounts.medium}</div>
            <div class="stat-label">${t('header.report.mediumRiskCount')}</div>
          </div>
          <div class="stat-card low">
            <div class="stat-value">${riskCounts.low}</div>
            <div class="stat-label">${t('header.report.lowRiskCount')}</div>
          </div>
          <div class="stat-card total">
            <div class="stat-value">${events.length}</div>
            <div class="stat-label">${t('header.report.totalCount')}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>${t('header.report.recordsDetail')}</h2>
        ${noEventsHTML}
        ${eventsHTML}
      </div>
      
      <div class="footer">
        <p>${t('header.report.title')} - ${timestamp}</p>
      </div>
    </div>
  `;

  const filename = `潜在风险记录报告_${caseNumber}_${format(now, 'yyyyMMdd_HHmmss')}`;
  
  return { content, filename };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const reportStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", "Noto Sans TC", "Microsoft YaHei", "SimHei", "WenQuanYi Micro Hei", sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1e293b;
    background: #fff;
  }
  .report-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px 20px;
    background: #fff;
  }
  h1 {
    font-size: 20pt;
    color: #1e293b;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #4f46e5;
  }
  h2 {
    font-size: 16pt;
    color: #334155;
    margin: 24px 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
  }
  h3 {
    font-size: 13pt;
    color: #475569;
    margin: 16px 0 8px 0;
  }
  .section {
    margin-bottom: 24px;
    page-break-inside: avoid;
  }
  ul {
    list-style: none;
    padding-left: 0;
  }
  ul li {
    padding: 6px 0;
    color: #334155;
  }
  ul li strong {
    color: #1e293b;
    min-width: 140px;
    display: inline-block;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 16px 0;
  }
  .stat-card {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px;
    text-align: center;
    page-break-inside: avoid;
  }
  .stat-card.high { border-left: 4px solid #dc2626 !important; }
  .stat-card.medium { border-left: 4px solid #d97706 !important; }
  .stat-card.low { border-left: 4px solid #059669 !important; }
  .stat-card.total { border-left: 4px solid #4f46e5 !important; }
  .stat-value {
    font-size: 24pt;
    font-weight: bold;
    color: #1e293b;
  }
  .stat-label {
    font-size: 9pt;
    color: #64748b;
    margin-top: 4px;
  }
  .record {
    margin: 20px 0;
    page-break-inside: avoid;
  }
  .record-header {
    background: #f8fafc !important;
    padding: 10px 14px;
    border-radius: 6px 6px 0 0;
    border: 1px solid #e2e8f0;
    border-bottom: none;
  }
  .record-title {
    font-size: 12pt;
    font-weight: 600;
    color: #1e293b;
  }
  .record-content {
    background: #fff !important;
    border: 1px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 6px 6px;
    padding: 14px;
  }
  .record-content p {
    margin: 8px 0;
    font-size: 10pt;
  }
  .record-content p strong {
    color: #475569;
    min-width: 130px;
    display: inline-block;
  }
  .content-section {
    margin-top: 12px;
  }
  .content-label {
    margin-bottom: 8px !important;
  }
  .content-text {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 12px;
    font-family: "Courier New", Courier, "SimSun", monospace;
    font-size: 9pt;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #334155;
  }
  .indicator {
    display: inline-block;
    background: #fef3c7 !important;
    color: #92400e;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 8pt;
    margin-right: 6px;
    border: 1px solid #fcd34d;
  }
  .indicator-none {
    color: #94a3b8;
    font-style: italic;
  }
  .record-separator {
    border: none;
    border-top: 2px dashed #e2e8f0;
    margin: 24px 0;
  }
  .no-events {
    text-align: center;
    color: #94a3b8;
    padding: 40px;
    font-style: italic;
  }
  .footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    font-size: 9pt;
    color: #94a3b8;
  }
  @page {
    size: A4;
    margin: 15mm;
  }
  @media print {
    body { 
      background: white !important;
    }
    .report-container {
      max-width: 100%;
      padding: 0;
    }
    .no-print {
      display: none !important;
    }
  }
`;

export function downloadPDF(htmlContent, filename) {
  const printWindow = window.open('', '_blank', 'width=1200,height=900');
  
  if (!printWindow) {
    alert('请允许弹出窗口以生成报告');
    return;
  }
  
  const fullHTML = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${filename}</title>
      <style>${reportStyles}</style>
      <style>
        .print-guide {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 24px;
          text-align: center;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .print-guide h3 {
          margin: 0 0 8px 0;
          font-size: 16pt;
          border: none;
          color: white;
        }
        .print-guide p {
          margin: 0;
          font-size: 11pt;
          opacity: 0.95;
        }
        .print-guide strong {
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .print-guide .steps {
          display: inline-block;
          text-align: left;
          margin-top: 10px;
        }
        .print-guide .steps span {
          display: block;
          margin: 4px 0;
        }
        .close-guide {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18pt;
          line-height: 1;
        }
        .close-guide:hover {
          background: rgba(255,255,255,0.3);
        }
        body.has-guide {
          padding-top: 100px;
        }
      </style>
    </head>
    <body class="has-guide">
      <div class="print-guide no-print">
        <h3>📄 保存为 PDF</h3>
        <p>请按 <strong>Ctrl+P</strong> (Windows) 或 <strong>Cmd+P</strong> (Mac) 打开打印对话框，然后选择 <strong>"另存为 PDF"</strong></p>
        <div class="steps">
          <span>1️⃣ 按 Ctrl+P / Cmd+P 打开打印</span>
          <span>2️⃣ 目标打印机选择 <strong>"另存为 PDF"</strong></span>
          <span>3️⃣ 点击 <strong>"保存"</strong></span>
        </div>
        <button class="close-guide" onclick="this.parentElement.remove(); document.body.classList.remove('has-guide'); document.body.style.paddingTop=0;">×</button>
      </div>
      ${htmlContent}
    </body>
    </html>
  `;
  
  printWindow.document.write(fullHTML);
  printWindow.document.close();
}

export function exportReport(events, filters, caseNumber, t, getChannelLabel) {
  const { content, filename } = generateHTMLContent(events, filters, caseNumber, t, getChannelLabel);
  downloadPDF(content, filename);
}
