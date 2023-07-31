// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../node_modules/@openzeppelin/contracts/utils/Counters.sol';
import '../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract WinenwinToken is ERC1155, Ownable, ERC1155URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    string public constant name = 'winenwin';
    string public constant symbol = 'WIN';
    string private _uri;

    constructor() ERC1155(_uri) {
        _setBaseURI('https://gateway.pinata.cloud/ipfs/');
    }

    mapping(uint256 => string) private _tokenURIs;

    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }

    function mint(address account, uint256 amount, string memory _tokenURI) public onlyOwner nonReentrant {
        _tokenId.increment();
        uint256 tokenId = _tokenId.current();
        _setURI(tokenId, _tokenURI);
        _mint(account, tokenId, amount, '');
    }

    function addTokenSupply(uint256 tokenId, uint256 amount) public onlyOwner nonReentrant {
        _mint(msg.sender, tokenId, amount, '');
    }

    function removeTokenSupply(uint256 tokenId, uint256 amount) public onlyOwner nonReentrant {
        _burn(msg.sender, tokenId, amount);
    }

    function mintBatch(address to, uint256[] memory amounts, string[] memory tokenURIs) public onlyOwner nonReentrant {
        require(amounts.length == tokenURIs.length, 'Input array length mismatch');

        uint256[] memory ids = new uint256[](amounts.length);
        for (uint256 i = 0; i < amounts.length; i++) {
            _tokenId.increment();
            uint256 tokenId = _tokenId.current();
            _setURI(tokenId, tokenURIs[i]);
            ids[i] = tokenId;
        }
        _mintBatch(to, ids, amounts, '');
    }

    function getNftAmount() external view returns (uint256) {
        uint256 tokenId = uint256(_tokenId.current());
        return tokenId;
    }
}
