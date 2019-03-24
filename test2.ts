import axios from "axios";

const key = "bb123";

// (async () => {
//   const res = await axios.post("https://bilchain.herokuapp.com/balance", {
//     key: key,
//     amount: 105
//   });

//   const response = await axios.get(`https://bilchain.herokuapp.com/balance/${key}`);
//   console.log(response.data);
// })();

(async () => {
  const res = await axios.post("https://bilchain.herokuapp.com/transaction", {
    sender: "aa123",
    receiver: "bb123",
    amount: 20
  });

  console.log(res.data);
})();