export default {
    getResults: function() {
        const results = JSON.parse(localStorage.getItem("results"))
        return results ? results.sort((a, b) => Number(b.score) - Number(a.score)) : [];
    },
    setScore: function(score) {
        const newItem = {
            score: score,
            datetime: this.getCurrentTime()
        };
        const results = this.getResults();
        if(results.length < 5) {
            results.push(newItem);
        } else {
            for (let i = 0; i < results.length; i++) {
                if(score > results[i].score) {
                    results.splice(i, 0, newItem);
                    break;
                }
            }
        }
        if(results.length > 5) {
            results.length = 5;
        }
        localStorage.setItem("results", JSON.stringify(results));
    },

    getCurrentTime: function() {
        const date = new Date();
        return ("0" + date.getDate()).slice(-2) + "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            date.getFullYear() + " " +
            ("0" + date.getHours()).slice(-2) + ":" +
            ("0" + date.getMinutes()).slice(-2);
    }
}
