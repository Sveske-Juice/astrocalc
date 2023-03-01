class Vector {
    constructor(x, y) {
        this.m_X = x;
        this.m_Y = y;
    }

    get x() {
        return this.m_X;
    }

    get y() {
        return this.m_Y;
    }

    set x(value) {
        this.m_X = value;
    }

    set y(value) {
        this.m_Y = value;
    }
}