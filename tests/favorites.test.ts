import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Favorites } from "../target/types/favorites";
import { airdropIfRequired, getCustomErrorMessage } from '@solana-developers/helpers';
import { expect, describe, test } from '@jest/globals';
import { systemProgramErrors } from './system-program-errors';


describe("favorites", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Favorites as Program<Favorites>;

  test("Writes our favorites to the blockchain", async () => {
    const user = anchor.web3.Keypair.generate();
    const program = anchor.workspace.Favorites as Program<Favorites>;

    console.log(`User public key: ${user.publicKey}`)

    await airdropIfRequired(
      anchor.getProvider().connection,
      user.publicKey,
      0.5 * web3.LAMPORTS_PER_SOL,
      1 * web3.LAMPORTS_PER_SOL
    )

    const favoriteNumber = new anchor.BN(22);
    const favoriteColor = 'red';

    let tx: string | null = null;

    try {
      tx = await program.methods
        .setFavorites(favoriteNumber, favoriteColor)
        .accounts({
          user: user.publicKey
        })
        .signers([user])
        .rpc();
    } catch (thrownObject) {
      const rawError = thrownObject as Error;
      throw new Error(getCustomErrorMessage(systemProgramErrors, rawError.message));
    }

    const [favoritesPda, _favoritesBump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('favorites'), user.publicKey.toBuffer()],
      program.programId
    )

    const dataFromPda = await program.account.favorites.fetch(favoritesPda);
    expect(dataFromPda.color).toEqual(favoriteColor);
    expect(dataFromPda.number.toNumber()).toEqual(favoriteNumber.toNumber());
    console.log('Amogus')
  });
});
