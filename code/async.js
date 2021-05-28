function sleep(time) {
  return new Promise(function (resolve, reject) {
    setimeout(resolve, time);
  })
}
async function lightDuration(time, color) {
  console.log("color:"+color)
  await sleep(time);
}
async function main() {
  while (true) {
    await lightDuration(3000, "yellow");
    await lightDuration(1000, "green");
    await lightDuration(2000,"red");
  }
}
main();
