// modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// modulos internos
const fs = require('fs')

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices:[
                'Criar conta',
                'Consultar saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        },
    ])
    .then((answer) => {
        const action = answer['action']
        if(action === 'Criar conta') {
            createAccount()
        } else if (action === 'Consultar saldo') {

        } else if (action === 'Depositar') {
            deposit()
        } else if (action === 'Sacar') {

        } else if (action === 'Sair') {
            console.log(chalk.bgBlue('Obrigada por usar nosso banco!'))
            process.exit() // para encerrar o processo no terminal
        }
        
    })
    .catch((err) => console.log(err))
}

function createAccount() {
    console.log(chalk.bgGreen('Obrigada por escolher nosso banco'))
    console.log(chalk.green('Defina as opções da sua conta'))
    buildAccount()
}
function buildAccount() {
    inquirer.prompt([
        {
            name:'accountName',
            message:'Digite um nome para sua conta'
        },
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        console.log(accountName)

        if(!fs.existsSync('accounts')) { //verifica se no projeto existe a pasta account
            fs.mkdirSync('accounts') //se não tiver, cria
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) { // se já existir conta com aquele nome em account ele retorna para o usuario inserir outro nome
            console.log(chalk.bgRed('Esse nome de conta já existe, escolha outro'))
            buildAccount()
            return
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            '{"balnce":0}',
            function (err) { console.log(err)}
        )

        console.log(chalk.green('Parabéns, sua conta foi criada!'))
        operation()
    })
    .catch((err) => console.log(err))
}
//faz processo do depósito
function deposit() {
    //parte 1
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        },
    ])
    .then((answer) => {
        const accountName = answer['accountName']
        if (!checkAccount(accountName)){
            return deposit() //se a conta não existir volta no menu
        }
        //parte 2
        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto deseja depositar?'
            }
        ])
        .then((answer) => {
            const amount = answer['amount']
            addAmount(accountName,amount) //faz o deposito
            operation() //volta pro menu
        })
    })

    
}
//verifica se a conta existe
function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe!'))
        return false
    }
    return true
}
//pega nome da conta
function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, { encoding: 'utf8', flag: 'r'}) //lê o arquivo json e muda para utf8
    return JSON.parse(accountJSON) //converte para json
}
//faz o depoisito de fato, adiciona valor a conta 
function addAmount(accountName,amount) {
    const accountData = getAccount(accountName)

    if(!amount) { //se o usuario não passar o valor para depositar
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }
    //parte 1
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) //adiciona no formato do js
    // parte 2
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData), //converte o valor de js para json
        function(err) {
            console.log(err)
        }
    )
    //parte 3
    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}
