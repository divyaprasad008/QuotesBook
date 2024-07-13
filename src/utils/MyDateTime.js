class MyDateTime{
    
    getFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = String(today.getMonth() + 1); // Add 1 for zero-based indexing
        let day = String(today.getDate());
      
        // Add leading zeros for single-digit month and day
        month = month.length === 1 ? `0${month}` : month;
        day = day.length === 1 ? `0${day}` : day;
      
        return `${year}-${month}-${day}`;
    }
}

export {MyDateTime}