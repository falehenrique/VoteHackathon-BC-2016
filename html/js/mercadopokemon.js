/*
Copyright (c) 2016 Edilson Osorio Junior - OriginalMy.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

var Web3 = require('web3');
var web3 = new Web3();
var eth = web3.eth;

var txutils = lightwallet.txutils;
var signing = lightwallet.signing;
var encryption = lightwallet.encryption;

/* ABI dos três Dapps */
var abiPokeCoin = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"marketAddress","type":"address"}],"name":"updatePokeMarketAddress","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"pokeMarketAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"qtdCoinsToDelete","type":"uint256"}],"name":"vanishCoins","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newSupply","type":"uint256"}],"name":"issueNew","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"owned","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"account1Demo","type":"address"},{"name":"account2Demo","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
var abiPokeCentral = [{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"marketAddress","type":"address"}],"name":"updatePokeMarketAddress","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"totalPokemonSupply","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pokeOwnerIndex","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pokeMasters","outputs":[{"name":"pokeMaster","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"pokeMarketAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pokemonToMaster","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pokemons","outputs":[{"name":"pokeNumber","type":"uint256"},{"name":"pokeName","type":"string"},{"name":"pokeType","type":"string"},{"name":"pokemonHash","type":"bytes32"},{"name":"pokeOwner","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_pokemonID","type":"uint256"},{"name":"_cp","type":"uint256"},{"name":"_hp","type":"uint256"}],"name":"updatePokemon","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"pokemonNumber","type":"uint256"},{"name":"cp","type":"uint256"},{"name":"hp","type":"uint256"}],"name":"newPokemon","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_pokemonID","type":"uint256"}],"name":"transferPokemon","outputs":[{"name":"pokemonID","type":"uint256"},{"name":"from","type":"address"},{"name":"to","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"pokemonNameTypes","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"pokemonMaster","type":"address"}],"name":"newPokemonMaster","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"owned","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_pokeOwner","type":"address"}],"name":"listPokemons","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"totalPokemonsFromMaster","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[{"name":"account1Demo","type":"address"},{"name":"account2Demo","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"cp","type":"uint256"},{"indexed":false,"name":"hp","type":"uint256"}],"name":"CreatePokemon","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"cp","type":"uint256"},{"indexed":false,"name":"hp","type":"uint256"}],"name":"UpdatePokemon","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"total","type":"uint256"}],"name":"UpdateMasterPokemons","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"}],"name":"Log1","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Log2","type":"event"}];
var abiPokeMarket = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pokeSales","outputs":[{"name":"pokeSeller","type":"address"},{"name":"pokeBuyer","type":"address"},{"name":"pokeID","type":"uint256"},{"name":"pokePrice","type":"uint256"},{"name":"pokeSold","type":"bool"},{"name":"pokeSellActive","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"newPokecoinAddress","type":"address"},{"name":"newPokecentralAddress","type":"address"}],"name":"updatePokecoinAndPokemarketAddresses","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pokeSaleIndex","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pokeSelling","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"pokeSellerAddress","type":"address"},{"name":"pokemonID","type":"uint256"},{"name":"pokemonSalePrice","type":"uint256"}],"name":"newSale","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalPokemonSales","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"pokeCoin","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"pokeSellerAddress","type":"address"},{"name":"pokemonID","type":"uint256"}],"name":"stopSale","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"pokeCentral","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"pokeBuyerAddress","type":"address"},{"name":"pokemonID","type":"uint256"}],"name":"buyPokemon","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"totalActiveSales","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"owned","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"pokeMasterSelling","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"type":"function"},{"inputs":[{"name":"pokeCoinAddress","type":"address"},{"name":"pokeCentralAddress","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pokeSellerAddress","type":"address"},{"indexed":false,"name":"pokemonID","type":"uint256"},{"indexed":false,"name":"pokemonSalePrice","type":"uint256"}],"name":"NewSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pokeSellerAddress","type":"address"},{"indexed":false,"name":"pokemonID","type":"uint256"}],"name":"StopSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pokeBuyerAddress","type":"address"},{"indexed":false,"name":"pokeSellerAddress","type":"address"},{"indexed":false,"name":"pokemonID","type":"uint256"}],"name":"PokeTrade","type":"event"}];

/* Endereços dos Dapps */
var pokeCoinAddress = '0x5e631686f4E16b2CF2c769971179161BdC3b2E8C';
var pokeCentralAddress = '0x4e6465F66b3a157316e0b1C2520D62735d79fC36';
var pokeMarketAddress = '0x025C463faaD2515Ab292Bd62853AbAc9398f2c0B';

/* Carregamento dos Contratos */
var MyPokeCoinContract = web3.eth.contract(abiPokeCoin);
var pokeCoin = MyPokeCoinContract.at(pokeCoinAddress);

var MyPokeCentralContract = web3.eth.contract(abiPokeCentral);
var pokeCentral = MyPokeCentralContract.at(pokeCentralAddress);

var MyPokeMarketContract = web3.eth.contract(abiPokeMarket);
var pokeMarket = MyPokeMarketContract.at(pokeMarketAddress);

var keystore;

var accountAddress = "xxx";
var password = 'mercadopokemon';

/* Inicializa conexão com o node local */
web3.setProvider(new web3.providers.HttpProvider());

function setWeb3Provider(keystore) {
    var web3Provider = new HookedWeb3Provider({
      host: "http://localhost:8545",
      transaction_signer: keystore
    });

    web3.setProvider(web3Provider);
};

/* Criação/carregamento do account */
lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

	/* Se for criar uma nova conta com um novo seed, descomente as duas linhas abaixo */

	//var extraEntropy = 'mercadopokemon129387612348917236';
	//seed = lightwallet.keystore.generateRandomSeed(extraEntropy);

	console.info("seed====" + seed);
	console.info("pwDerivedKey====" + pwDerivedKey);
	keystore = new lightwallet.keystore(seed, pwDerivedKey);
	console.info("=====pwDerivedKey===="+pwDerivedKey);
	keystore.generateNewAddress(pwDerivedKey, 1);

	accountAddress = keystore.getAddresses()[0];

	web3.eth.defaultAccount = eth.accounts[0];

});


function showPainel(){
	var addressTo = "0x1ed59c2675c2a14182f93d68311f6f3a681d220e";

	var qtdePokemons = pokeCentral.totalPokemonsFromMaster('0x'+addressTo);

  console.info("====qtdePokemons======"+qtdePokemons);
	document.getElementById("totalPokemons").innerText = 'Qtde : ' + qtdePokemons + ' candidato(s)';


	/* Constrói informações sobre cada Pokémon da conta */
	var html = '<table class="pure-table pure-table-horizontal">';
	html += '<thead><tr><th>ID</th><th>Canditato</th><th>Tipo</th></tr></thead><tbody>'

	var htmlCandidatoA = 0;
	var htmlCandidatoB = 0;
	var htmlCandidatoC = 0;
	for (i=0; i<qtdePokemons; i++){
		html += '<tr>'
		var pokeID = pokeCentral.balanceOf('0x'+addressTo, i);
		html += '<td>' + pokeID + '</td>'
		for (j=1; j<3; j++){
			var conteudo = pokeCentral.pokemons(pokeID)[j]
			if (conteudo == "A") {
				htmlCandidatoA += 1;
			} else 	if (conteudo == "B") {
				htmlCandidatoB += 1;
			} else 	if (conteudo == "C") {
				htmlCandidatoC += 1;
			}
			html += '<td class="conteudo">' + conteudo + '</td>';
		}
		html += '</tr>';
	}
	html+='</tbody></table>'
	$(".pokemonList").html(html);
	$(".htmlCandidatoA").html(htmlCandidatoA);
	$(".htmlCandidatoB").html(htmlCandidatoB);
	$(".htmlCandidatoC").html(htmlCandidatoB);

};



function showStatus(){
	var currentBalance = pokeCoin.balanceOf('0x'+accountAddress).toNumber();
	var qtdePokemons = pokeCentral.totalPokemonsFromMaster('0x'+accountAddress);


	/* Constrói informações sobre cada Pokémon da conta */
	var html = '<table class="pure-table pure-table-horizontal">';
	html += '<thead><tr><th>ID</th><th>Canditato</th><th>Tipo</th></tr></thead><tbody>'
	for (i=0; i<qtdePokemons; i++){
		html += '<tr>'
		var pokeID = pokeCentral.balanceOf('0x'+accountAddress, i);
		html += '<td>' + pokeID + '</td>'
		for (j=1; j<3; j++){
			html += '<td>' + pokeCentral.pokemons(pokeID)[j] + '</td>';
		}
		html += '</tr>';
	}
	html+='</tbody></table>'

	document.getElementById("pokemonList").innerHTML = html;
};

function transferPokemon(){
	var pokeIDSell = document.getElementById("pokeIDSell").value;
	var addressTo = "0x1ed59c2675c2a14182f93d68311f6f3a681d220e";

	pokeCentral.transferPokemon('0x'+accountAddress, '0x'+addressTo, pokeIDSell, {value: 0, gas: 290654, gasPrice: 20000000000}, function(err, hash) {

		if (!err){
			console.log("Transacao enviada: " + hash);
			document.getElementById("msgVenda").innerText = hash;
		} else {
			console.log("Erro no envio: " + err);
			document.getElementById("msgVenda").innerText = err;
		};
	});
	var pokeIDSell = document.getElementById("pokeIDSell").value = '';
}


/* Filtro do web3 para atualizar os valores automaticamente */
var filter = web3.eth.filter('latest');
filter.watch(function(error, result) {
	if (!error) {
		showStatus()
	}
});
