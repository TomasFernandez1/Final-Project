import { Command } from 'commander'

export const program = new Command()

program.option('--mode <mode>', 'Working mode', 'production').parse()
