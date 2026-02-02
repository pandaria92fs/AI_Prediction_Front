/**
 * 去掉 aILogicSummary 开头的「🔗 URL」行及紧随的换行，其余保留
 */
export function stripLeadingLinkFromAiSummary(summary: string | undefined): string {
  if (!summary) return '';
  return summary.replace(/^🔗\s*[^\n]+\r?\n+/i, '').trimStart();
}

/** 列表页用：先去掉开头的「🔗 URL」整行，再只显示 📊 前面的内容 */
const LIST_PAGE_SUMMARY_MARKER = '📊';

export function getListPageAiSummary(summary: string | undefined): string {
  const stripped = stripLeadingLinkFromAiSummary(summary);
  if (!stripped) return '';
  const markerIndex = stripped.indexOf(LIST_PAGE_SUMMARY_MARKER);
  if (markerIndex === -1) return stripped;
  return stripped.slice(0, markerIndex).trimEnd();
}
