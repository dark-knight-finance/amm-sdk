import { ChainId, Token, Pair, TokenAmount, Price } from '../src'

describe('Pair', () => {

  const WETH = new Token(ChainId.MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WETH', 'USD Coin')
  const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  // describe('constructor', () => {
  //   it('cannot be used for tokens on different chains', () => {
  //     expect(() => new Pair(new TokenAmount(WETH, '100'), new TokenAmount(WETH, '100'))).toThrow(
  //       'CHAIN_IDS'
  //     )
  //   })
  // })

  // describe('#getAddress', () => {
  //   it('returns the correct address', () => {
  //     expect(Pair.getAddress(WETH, DAI)).toEqual('0xcA069B7AC1B9759D5f0547aa550c9c51d71D36d1')
  //   })
  // })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '100')).token0).toEqual(DAI)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(WETH, '100')).token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '100')).token1).toEqual(WETH)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(WETH, '100')).token1).toEqual(WETH)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '101')).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(WETH, '100')).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '101')).reserve1).toEqual(
        new TokenAmount(WETH, '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(WETH, '100')).reserve1).toEqual(
        new TokenAmount(WETH, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(WETH, '101'), new TokenAmount(DAI, '100')).token0Price).toEqual(
        new Price(DAI, WETH, '100', '101')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(WETH, '101')).token0Price).toEqual(
        new Price(DAI, WETH, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(WETH, '101'), new TokenAmount(DAI, '100')).token1Price).toEqual(
        new Price(WETH, DAI, '101', '100')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(WETH, '101')).token1Price).toEqual(
        new Price(WETH, DAI, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(WETH, '101'), new TokenAmount(DAI, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token0Price)
      expect(pair.priceOf(WETH)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH)).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '101')).reserveOf(WETH)).toEqual(
        new TokenAmount(WETH, '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(WETH, '100')).reserveOf(WETH)).toEqual(
        new TokenAmount(WETH, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(DAI, '101'), new TokenAmount(WETH, '100')).reserveOf(WETH)
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '100')).chainId).toEqual(ChainId.MAINNET)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(WETH, '100')).chainId).toEqual(ChainId.MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '100')).involvesToken(WETH)).toEqual(true)
    expect(new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '100')).involvesToken(DAI)).toEqual(true)
    expect(
      new Pair(new TokenAmount(WETH, '100'), new TokenAmount(DAI, '100')).involvesToken(WETH)
    ).toEqual(false)
  })
})
