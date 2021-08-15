const demNguoc = (num) => {
  if (num < 1) return;
  console.log(num);
  demNguoc(num - 1);
};
demNguoc(20);

// var allMembers = [
//   { name: "DungLT", team: null },
//   { name: "Tung", team: "DungLT" },
//   { name: "Tan", team: "DungLT" },
//   { name: "Khanh", team: "Tung" },
//   { name: "DungTC", team: "Tung" },
//   { name: "Khoi", team: null },
//   { name: "Tri", team: "Tan" },
//   { name: "Dat", team: "Tan" },
//   { name: "Tuong", team: "Duoc" },
//   { name: "Duoc", team: "Khoi" },
//   { name: "Toan", team: "Khoi" },
//   { name: "Thien", team: "Toan" },
//   { name: "Vy", team: "Duoc" },
//   { name: "Thanh", team: "Toan" },
// ];

// function cay(name) {
//   var results = {};
//   allMembers
//     .filter((item) => (item.team = name))
//     .forEach((item) => (results[item.name] = cay(item.name)));
//   return results;
// }

// console.log(JSON.stringify(cay(), null, 2));
