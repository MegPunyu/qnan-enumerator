export default class QNanEnumerator {

  /**
   * DataView for low-level computation.
   */
  #buf: DataView;

  /**
   * Creates a new QNanEnumerator instance.
   */
  public constructor() {
    this.#buf = new DataView(new ArrayBuffer(8));
  }

  /**
   * Returns the NaN value of the specified id.
   * 
   * @param id NaN id.
   * @returns NaN value of the specified id.
   * @throws {TypeError} Thrown if the id is not a number.
   * @throws {RangeError} Thrown if the id is not within the range.
   * @example
   * const qne = new QNanEnumerator();
   * const nan = qne.getNan(125);  // NaN
   */
  public getNan(id: number): typeof NaN {
    if (typeof id !== "number") {
      throw new TypeError("id must be a number");

    } else if (id < 0) {
      throw new RangeError("id must be greater than or equal to zero");

    } else if (2 ** 52 - 1 < id) {
      throw new RangeError("id must be less than 4,503,599,627,370,495");
    }

    this.#buf.setBigUint64(0, BigInt(id), false);

    const ID_H = this.#buf.getUint32(0, false);
    const ID_L = this.#buf.getUint32(4, false);

    const BIT_H = ID_H | ID_H << 12 & 0x8000_0000 | 0x7FF8_0000;
    const BIT_L = ID_L | 0;

    this.#buf.setUint32(0, BIT_H, false);
    this.#buf.setUint32(4, BIT_L, false);

    return this.#buf.getFloat64(0, false);
  }

  /**
   * Returns ID of the specified NaN value.
   * 
   * @param nan NaN value.
   * @returns ID of the specified NaN value.
   * @throws {TypeError} Thrown if non-NaN value is provided.
   * @throws {RangeError} Thrown if invalid NaN value is provided.
   * @example
   * const qne = new QNanEnumerator();
   * const nan = qne.getNan(125);  // NaN
   * const id  = qne.getId(nan);   // 125
   */
  public getId(nan: typeof NaN): number {
    if (!Number.isNaN(nan)) {
      throw new TypeError("non-NaN number provided");
    }

    this.#buf.setFloat64(0, nan, false);

    const BIT_H = this.#buf.getUint32(0, false);

    if ((BIT_H & 0x7FF8_0000) !== 0x7FF8_0000) {
      throw new RangeError("invalid NaN value provided");
    }

    const ID_H = BIT_H & 0x0007_FFFF | BIT_H >> 12 & 0x0008_0000;

    this.#buf.setUint32(0, ID_H, false);

    const id = this.#buf.getBigUint64(0, false);

    return Number(id);
  }
}
