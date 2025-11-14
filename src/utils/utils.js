// 當天日期

export function getTodyDate() {
  const today = new Date()
  const todayDate = today.getFullYear().toString() +
                    String(today.getMonth() + 1).padStart(2, '0') +
                    String(today.getDate()).padStart(2, '0');
  return todayDate;
}