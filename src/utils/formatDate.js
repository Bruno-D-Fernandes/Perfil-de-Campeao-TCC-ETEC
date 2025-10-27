const formatDate = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  value = value.replace(/(\d{4})(\d+)/, "$1");
  return value;
};

export default formatDate;
