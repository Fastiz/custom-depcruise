type Input = {
    text: string
}

const test = (input: Input) => {
    console.log(input.text)
}

test({text: 'hello world'})