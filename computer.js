// based on https://www.youtube.com/watch?v=Z5JC9Ve1sfI
// made by Austin
class computer {
    constructor(clockTickAsMs = 1) {
        this.RAM = new Uint8Array(16)
        this.registers = {
            program: null,
            instruction: null,
            accumulator: null
        }
        this.tickMS = clockTickAsMs
        this.interval = undefined
    }
    setRAM(newRAM = []) {
        this.interval = clearInterval(this.interval)
        let _RAM = new Uint8Array(16)
        // newRAM uses hex
        for (let address in _RAM) _RAM[address] = parseInt(newRAM[address], 16)
        this.RAM = _RAM
        Object.keys(this.registers).forEach(register => this.registers[register] = null)
        return _RAM
    }
    parseInstruction(instruction = 0) {
        let hexVersion = instruction.toString(16)
        if (hexVersion.length === 1) return false
        let parts = hexVersion.split('')
        switch(parts[0]) {
            case '1':
                return () => {
                    this.registers.accumulator = this.RAM[parseInt(parts[1], 16)]
                }
            case 'b':
                return () => {
                    this.registers.accumulator += this.RAM[parseInt(parts[1], 16)]
                }
            case '4':
                return () => {
                    this.RAM[parseInt(parts[1], 16)] = this.registers.accumulator
                }
            case 'd':
                return () => {
                    this.registers.program = this.RAM[parseInt(parts[1], 16)]
                }
        }
        return false
    }
    runProgram() {
        let step = 0
        let oldProgramCounter = 0
        this.interval = setInterval(() => {
            if (step === 0) {
                if (this.registers.program === null) this.registers.program = 0
                else if (this.registers.program === oldProgramCounter) this.registers.program++
                oldProgramCounter = this.registers.program
                this.registers.instruction = this.RAM[this.registers.program]
            }
            if (step === 1) {
                this.registers.instruction = this.parseInstruction(this.registers.instruction) 
                if (!this.registers.instruction) throw new Error(`RAM Address ${this.registers.program} is not an instruction.`)
            }
            if (step === 2) {
                this.registers.instruction()
            }
            step++
            if (step > 2) step = 0
        }, this.tickMS)
    }
}