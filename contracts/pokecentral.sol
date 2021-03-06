contract accessControlled {
    address public owner;
    address public pokeMarketAddress;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        /* o caracter "_" é substituído pelo corpo da funcao onde o modifier é utilizado */
        _
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }

    function updatePokeMarketAddress(address marketAddress) onlyOwner {
        pokeMarketAddress = marketAddress;
    }

}


contract PokeCentral is accessControlled {

    uint256 public totalPokemonSupply;

    Pokemon[] public pokemons;
    PokemonMaster[] public pokeMasters;

    mapping (uint256 => address) public pokemonToMaster;
    mapping (address => uint256) public pokeOwnerIndex;
    mapping (address => uint256) public totalPokemonsFromMaster;
    mapping (address => uint256[]) public balanceOf;

    struct Pokemon {
        uint pokeNumber;
        string pokeName;
        string pokeType;
        bytes32 pokemonHash;
        address pokeOwner;
    }

    struct PokemonMaster {
        address pokeMaster;
        uint[] pokemons;
    }

    /* Exemplo de array bidimensional para armazenar o nome do pokemon e seu tipo. O índice é seu número na Pokedex */
    string[][] public pokemonNameTypes = [["Candidato 0", "invalid"],["Candidato 1", "A"], ["Candidato 2", "B"], ["Candidato 3", "C"],["Candidato 1", "A"], ["Candidato 2", "B"], ["Candidato 3", "C"]]; // Este tipo não aceita bytes

    /* Gera um evento publico no blockchain e avisa os clientes que estao monitorando */
    event Transfer(address from, address to, uint256 value);
    event CreatePokemon(uint id, string name, string pokeType);
    event UpdateMasterPokemons(address owner, uint total);
    event Log1(uint number);
    event Log2(string message);

    /* Inicializa o contrato */
    function PokeCentral(address account1Demo, address account2Demo) {
        owner = msg.sender;

        newPokemonMaster(owner);                            // Todos pokemons serao criados para este owner

        /*
        Há um problema com um array de indices, pois quando um item é excluído, é substituído por 0.
        Então vamos criar um pokemon fake no primeiro item e ajustar a quantidade para ignorá-lo
        */
        newPokemon(0);                                  // Pokemon Índice 0
        totalPokemonSupply-=1;                              // Ajusta o total de pokemons porque o primeiro é fake

        /*Criacao de pokemons iniciais*/
        newPokemon(1);
        newPokemon(2);
        //newPokemon(3);

        //newPokemon(4);
        //newPokemon(5);
        //newPokemon(6);

        /* Se as contas demo forem apresentadas no carregamento, então os pokemons criados serão distribuidos entre elas */
        if (account1Demo != 0 && account2Demo != 0){
            //transferPokemon(msg.sender, account1Demo, 1);
            //transferPokemon(msg.sender, account1Demo, 2);
            //transferPokemon(msg.sender, account1Demo, 3);

            //transferPokemon(msg.sender, account2Demo, 4);
            //transferPokemon(msg.sender, account2Demo, 5);
            //transferPokemon(msg.sender, account2Demo, 6);
        }
    }

    /* Criar novo Pokemon */
    function newPokemon(uint pokemonNumber) onlyOwner returns (bool success) { // cp e hp podem ser fornecidos randomicamente por https://api.random.org/json-rpc/1/basic
        uint pokemonID = pokemons.length++;
        Pokemon p = pokemons[pokemonID];
        p.pokeNumber = pokemonNumber;
        p.pokeName = pokemonNameTypes[pokemonNumber][0];
        p.pokeType = pokemonNameTypes[pokemonNumber][1];

        p.pokemonHash = sha3(p.pokeNumber,p.pokeName,p.pokeType); // Hash de verificacao das infos do pokémon
        p.pokeOwner = owner;
        pokemonToMaster[pokemonID] = owner;
        addPokemonToMaster(owner, pokemonID);

        totalPokemonSupply += 1;
        CreatePokemon(pokemonID, p.pokeName, p.pokeType);
        return true;
    }

    /* Criar novo Mestre Pokemon */
    function newPokemonMaster(address pokemonMaster) onlyOwner returns (bool success) {
        uint ownerID = pokeMasters.length++;
        PokemonMaster o = pokeMasters[ownerID];
        o.pokeMaster = pokemonMaster;
        pokeOwnerIndex[pokemonMaster] = ownerID;
        return true;
    }

    /* Transferencia de Pokemons */
    function transferPokemon(address _from, address _to, uint256 _pokemonID) returns (uint pokemonID, address from, address to) {
        if (msg.sender != owner && msg.sender != pokeMarketAddress) throw;
        Pokemon p = pokemons[_pokemonID];
        if (p.pokeOwner != _from) throw;
        /* Se o Mestre Pokémon não existe ainda, crie-o */
        if (pokeOwnerIndex[_to] == 0 && _to != pokemonToMaster[0] ) newPokemonMaster(_to);
        p.pokeOwner = _to;
        pokemonToMaster[_pokemonID] = _to;
        delPokemonFromMaster(_from, _pokemonID);
        addPokemonToMaster(_to, _pokemonID);
        Transfer(_from, _to, _pokemonID);
        return (_pokemonID, _from, _to);
    }

    /* Vincula um pokemon ao seu treinador */
    function addPokemonToMaster(address _pokemonOwner, uint256 _pokemonID) internal returns (address pokeOwner, uint[] pokemons, uint pokemonsTotal) {
        if (msg.sender != owner && msg.sender != pokeMarketAddress) throw;

        uint ownerID = pokeOwnerIndex[_pokemonOwner];
        PokemonMaster o = pokeMasters[ownerID];
        uint[] pokeList = o.pokemons;

        /* usando array.push ele adiciona 0,_pokemonID no array */
        // o.pokemons.push(_pokemonID);

        /*
        Ao invés de simplesmente adicionar um pokemon ao final da lista, verifica se há slot zerado no array, senao adiciona ao final.
        O blockchain não apaga itens, o uso de 'delete array[x]' substitui o item por 0.
        Ex:
        array[] = [ 1, 2, 3, 4 ]
        delete array[3];
        array[] = [ 1, 2, 0, 4 ]
        */

        bool slot;
        for (uint i=0; i < pokeList.length; i++){
            if (pokeList[i] == 0){
                slot = true;
                break;
            }
        }
        if (slot == true){
            o.pokemons[i] = _pokemonID;
        } else {
            uint j = pokeList.length++;
            o.pokemons[j] = _pokemonID;
        }
        balanceOf[_pokemonOwner] = cleanArray(o.pokemons);

        qtdePokemons(_pokemonOwner);
        UpdateMasterPokemons(_pokemonOwner, o.pokemons.length);
        return (_pokemonOwner, o.pokemons, o.pokemons.length);
    }

    /* Desvincula um pokemon do seu treinador */
    function delPokemonFromMaster(address _pokemonOwner, uint256 _pokemonID) internal  returns (address pokeOwner, uint[] pokemons, uint pokemonsTotal) {
        if (msg.sender != owner && msg.sender != pokeMarketAddress) throw;

        uint ownerID = pokeOwnerIndex[_pokemonOwner];
        PokemonMaster o = pokeMasters[ownerID];
        uint[] pokeList = o.pokemons;

        for (uint i=0; i < pokeList.length; i++){
            if (pokeList[i] == _pokemonID){
                delete pokeList[i];
            }
        }

        // http://ethereum.stackexchange.com/questions/3373/how-to-clear-large-arrays-without-blowing-the-gas-limit
        o.pokemons=cleanArray(pokeList); // Rearranja o array, eliminando os itens zerados, a custo de gas

        balanceOf[_pokemonOwner] = cleanArray(o.pokemons);

        qtdePokemons(_pokemonOwner);
        UpdateMasterPokemons(_pokemonOwner, o.pokemons.length);
        return (_pokemonOwner, o.pokemons, o.pokemons.length);
    }

    /* Funcao ilustrativa: lista pokemons de um treinador pois o browser solidity não mostra o conteúdo dos arrays no struct e no mapping */
    function listPokemons( address _pokeOwner )  returns (address, uint[]){
        uint ownerID = pokeOwnerIndex[_pokeOwner];
        PokemonMaster o = pokeMasters[ownerID];

        /* Lista pokemons tanto do struct quanto do mapping. */
        return ( _pokeOwner, balanceOf[_pokeOwner] );
    }

    /* Conta a qtde de pokemons em um array que possui zeros */
    function qtdePokemons( address _pokeOwner) internal returns (uint qtde){
        if (msg.sender != owner && msg.sender != pokeMarketAddress) throw;

        uint ownerID = pokeOwnerIndex[_pokeOwner];
        PokemonMaster o = pokeMasters[ownerID];
        uint[] pokeList = o.pokemons;
        uint count = 0;
        for (uint i=0; i < pokeList.length; i++){
            if ( pokeList[i] > 0 ){
                count++;
            }
        }
        totalPokemonsFromMaster[_pokeOwner] = count;
        return count;
    }

    /* Exemplo 2: Conta a qtde de pokemons diretamente do mapping */
    function qtdePokemonsMapping( address _pokeOwner) internal returns (uint qtde){
        uint[] tempList = balanceOf[_pokeOwner];
        totalPokemonsFromMaster[_pokeOwner] = tempList.length;
        return tempList.length;
    }


    /* Esta funcao elimina todos os itens com zero do array, ao custo de gas */
    function cleanArray(uint[] pokeList) internal returns (uint[]){
        uint[] memory tempArray = new uint[](pokeList.length);
        uint j = 0;
        for (uint i=0; i < pokeList.length; i++){
            if ( pokeList[i] > 0 ){
                tempArray[j] = pokeList[i];
                j++;
            }
        }
        uint[] memory tempArray2 = new uint[](j);
        for (i=0; i< j; i++) tempArray2[i] = tempArray[i];
        return tempArray2;
    }

    /* Se tentarem enviar ether para o end desse contrato, ele rejeita */
    function () {
        throw;
    }
}
