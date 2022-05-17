/** Each write advances the internal offset into the buffer.
 * Grows the buffer to twice the current size if a write would exceed the buffer. */
export class BufWriter {
	private off = 0
	private buf: Buffer

	constructor(initialSize?: number) {
		this.buf = Buffer.alloc(initialSize || 1024)
	}

	/** Returns a slice reference to the written bytes so far. */
	getBuffer() {
		return this.buf.slice(0, this.off)
	}

	writeUInt8(val: number) {
		this.ensureSpace(1)
		this.buf.writeUInt8(val, this.off)
		this.off += 1
	}

	writeInt8(val: number) {
		this.ensureSpace(1)
		this.buf.writeInt8(val, this.off)
		this.off += 1
	}

	writeUInt16(val: number) {
		this.ensureSpace(2)
		this.buf.writeUInt16BE(val, this.off)
		this.off += 2
	}

	writeInt16(val: number) {
		this.ensureSpace(2)
		this.buf.writeInt16BE(val, this.off)
		this.off += 2
	}

	writeUInt32(val: number) {
		this.ensureSpace(4)
		this.buf.writeUInt32BE(val, this.off)
		this.off += 4
	}

	writeInt32(val: number) {
		this.ensureSpace(4)
		this.buf.writeInt32BE(val, this.off)
		this.off += 4
	}

	/** length-prefixed (16 bits), UTF-8 encoded */
	writeString(str: string) {
		const strBuf = Buffer.from(str, 'utf8')
		this.ensureSpace(2 + strBuf.length)
		this.buf.writeUInt16BE(strBuf.length, this.off)
		this.off += 2
		this.buf.set(strBuf, this.off)
		this.off += strBuf.length
	}

	writeBuf(buf: Buffer) {
		this.ensureSpace(buf.length)
		this.buf.set(buf, this.off)
		this.off += buf.length
	}

	private ensureSpace(bytes: number) {
		if (this.off + bytes > this.buf.length) {
			const newBuf = Buffer.alloc(this.buf.length * 2)
			this.buf.copy(newBuf, 0, 0, this.off)
			this.buf = newBuf
		}
	}
}