export const formatPrice = (value: string) => {
    // Hapus semua koma yang ada
    const num = value.replace(/,/g, "");

    // Format hanya jika angka valid
    if (num === "") return "";
    if (num === ".") return "0.";

    // Konversi ke format ribuan
    return new Intl.NumberFormat("eu-EU").format(parseFloat(num));
};
