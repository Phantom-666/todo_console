import readline from "readline"
import { readFile, writeFile } from "fs/promises"
import { todoPath } from "./config"

const readTodoList = async () => {
  const data = await readFile(todoPath, "utf-8")
  console.log("Your todo list:")

  const formated: string[] = []

  data.split("\n").map((s) => {
    if (s) formated.push(s)
  })

  formated.map((s, i) => {
    console.log(`${i + 1}. ${s}`)
  })
  console.log()
}

function askInConsole(q: string): Promise<String> {
  return new Promise((res, rej) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question(q, (i) => {
      res(i)

      rl.close()
    })
  })
}

const addNewTodoList = async () => {
  const todo = await askInConsole("TODO List to add : ")
  const data = await readFile(todoPath, "utf-8")

  const newData = data + todo + "\n"

  await writeFile(todoPath, newData)
}

const deleteTodo = async () => {
  await readTodoList()

  const index = Number(await askInConsole("TODO List to remove: ")) - 1
  const data = await readFile(todoPath, "utf-8")

  const formated: string[] = []

  data.split("\n").map((s) => {
    if (s) formated.push(s)
  })

  formated.splice(index, 1)

  const newData = formated.join("\n") + "\n"

  await writeFile(todoPath, newData)
}

const exitProgram = async () => {
  process.exit(0)
}

const menu = [
  {
    message: "show todo list",
    f: readTodoList,
  },
  { message: "add new todo", f: addNewTodoList },
  { message: "delete todo", f: deleteTodo },
  { message: "exit program", f: exitProgram },
]

const showMenu: () => Promise<number> = () =>
  new Promise(async (res, rej) => {
    menu.map((m, i) => console.log(`${i + 1}. ${m.message}`))

    const num = Number(await askInConsole(""))

    res(num)
  })

const checkMenu = (index: number) => {
  const test = menu[index - 1]

  return !!test
}

const run = async () => {
  const menuIndex = await showMenu()

  const status = checkMenu(menuIndex)

  if (!status) {
    console.log("it is not valid")

    return
  }

  const obj = menu[menuIndex - 1]

  await obj.f()
}

const loop = async () => {
  while (true) {
    await run()
  }
}

loop()
