pragma solidity ^0.4.11;

import "./owned.sol";


/*************************************
  *
  * Pixel token contract
  *
  *************************************/

contract PixelToken is owned {

    // ----------------------------------------------------
    //  PUBLIC VARIABLES
    // ----------------------------------------------------

    // make sure we can only define a total of 1M pixels (1000x1000)
    uint128 public _totalPixels = 1000000;
    uint256 public _initialPixelPrice = 10 finney; // initial pixel price (0.01ETH)

    // a Pixel
    struct Pixel {
        address owner;   // the current owner of the pixel. If not defined, it's the contract owner
        uint32  color;   // an RGBA color
        bytes32 link;    // an optional link to a website. Will assume it starts with `https://` to save space
    }

    // an offer to sell a pixel
    //struct PixelOffer {
    //    uint256 price; // price in wei
    //}

    // map a pixel to its index
    mapping (uint128 => Pixel) public pixels;

    // ----------------------------------------------------
    //  EVENTS
    // ----------------------------------------------------

    event PixelClaimed(uint128 pixelIndex, address owner, uint32 color, bytes32 link);
    event PixelChanged(uint128 pixelIndex, address owner, uint32 color, bytes32 link);
    event PixelTransferred(uint128 pixelIndex, address oldOwner, address newOwner);

    // ----------------------------------------------------
    //  MODIFIERS
    // ----------------------------------------------------

    // Functions with this modifier can only be executed by the pixel owner
    modifier onlyPixelOwner(uint128 pixelIndex) {
        require(msg.sender == pixels[pixelIndex].owner);
        _;
    }

    // check if the pixel index is valid
    modifier validPixel(uint128 pixelIndex) {
        require(pixelIndex < _totalPixels && pixelIndex >= 0);
        _;
    }

    // ----------------------------------------------------
    //  TRANSACTION FUNCTIONS
    // ----------------------------------------------------

    // Constructor
    function PixelToken() payable {
        // initialize the contract
        // @TODO: don't initialize all pixels, it's a bit of overkill
        //initPixels();
    }

    // anonymous hook
    function() payable {
        // just for depositing extra ether in the contract
    }

    // pixel manipulation functions

    // claim a pixel for the owner
    function claimPixel (uint128 pixelIndex, uint32 _color, bytes32 _link) validPixel(pixelIndex) payable returns (bool) {
        // the sender is only able to claim a pixel if he pays enough ether and the pixel is not yet owned

        // is the pixel already owned? - if so, you can't claim it
        require(pixels[pixelIndex].owner == 0x0);
        // has the sender paid enough ether to pay for the pixel?
        require(msg.value >= _initialPixelPrice);

        // OK, we can create the Pixel
        pixels[pixelIndex] = Pixel(msg.sender, _color, _link);

        // @TODO : send an event that someone has claimed a Pixel
        //PixelClaimed(pixelIndex, msg.sender, _color, _link);

        // success!
        return true;
    }

    // change the color of a pixel, can only be done by the pixel owner
    // for now, this is a free function
    function setPixelColor(uint128 pixelIndex, uint32 _color) validPixel(pixelIndex) onlyPixelOwner(pixelIndex) returns (bool) {
        pixels[pixelIndex].color = _color;

        // @TODO: fire a PixelChanged event
        //PixelChanged(pixelIndex);
    }

    // change the pixel link, can only be done by the pixel owner
    // the link has to be everything after the `https://` to save space
    function setPixelLink(uint128 pixelIndex, bytes32 _link) validPixel(pixelIndex) onlyPixelOwner(pixelIndex) returns (bool) {
        pixels[pixelIndex].link = _link;

        // @TODO: fire a PixelChanged event
        // PixelChanged(pixelIndex);
    }

    // ----------------------------------------------------
    //  CONSTANT FUNCTIONS
    // ----------------------------------------------------

    function totalSupply() constant returns (uint128) {
        return _totalPixels;
    }

    // get the owner of a pixel.
    // we assume the pixel has an owner. when a pixel has not been claimed, this function will return 0x0
    function getPixelOwner(uint128 pixelIndex) constant validPixel(pixelIndex) returns (address) {
        return pixels[pixelIndex].owner;
    }

    // get the color of a pixel.
    // we assume the pixel has a color. when a pixel has not been claimed, this function will return 0x0
    function getPixelColor(uint128 pixelIndex) constant validPixel(pixelIndex) returns (uint32) {
        return pixels[pixelIndex].color;
    }

    // get the link in a pixel
    // we assume the pixel has a link. when a pixel has not been claimed, this function will return 0x0
    function getPixelLink(uint128 pixelIndex) constant validPixel(pixelIndex) returns (bytes32) {
        return pixels[pixelIndex].link;
    }
}
