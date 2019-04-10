# YINR Wallet


## Difficulty

Based on the difficulty when miners try to add a new block, they will have to find
hash value for this block that matches the difficulty, for this matching
miners have to find same number of leading zeros as the current difficulty for 
the generated hash of the new block added to the chain.

difficulty = 3

hash = 000eb293b10ca3de8

nonce(Number used once) + block data = Regenerated hash

if you try to find this leading zeros randomly and try to get lucky
by creating a hash this becomes exponentially harder as the difficulty rises.

in order to find one with this difficylty, they will regenerate the hashes
for the same block based on the block data as well as adjusting value
called the nonce, by continually adjusting the value miner can generates
new hashes for the current block to find the current to satisy the difficulty.

nonce starts at zero , one, increments upto it has a matching number of leading zeros
according to the set difficulty, by this act of changing nounce values 
with the block data for generating hashes to match with the difficulty
level it takes decent amount of time, called proof of work.


## Mining

Mining is find to the correct hash of the block, when miner has successfully 
mined the block and has the values additionall difficulty and nonce values
when miner succesfully mined the block they then have the rights to
submit the block and shares the nounce values to other miners, then
other miners knows the nounce values then quickly verify the valid block
 and added block to thier chain.with out doing the same computational
work again.


## Mine Rate 

Suppose to create a block it has to take a max of 5 mins it is called mine rate.

Based on the minerate the difficulty in the system will be adjusted.

We compare the timestamp of present block and lastBlock called time diff

time diff < mine rate, then increase the difficulty level
time diff > mine rate, then decrease the difficulty level
