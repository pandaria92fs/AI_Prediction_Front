/**
 * 列表页用：去掉 aILogicSummary 开头的「🔗 URL」行及紧随的换行，其余保留
 */
export function stripLeadingLinkFromAiSummary(summary: string | undefined): string {
  if (!summary) return '';
  return summary.replace(/^🔗\s*[^\n]+\r?\n+/i, '').trimStart();
}
