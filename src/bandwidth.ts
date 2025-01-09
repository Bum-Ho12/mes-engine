// bandwidth.ts
class BandwidthDetector {
    private samples: Array<[number, number]> = [];
    private readonly windowSize = 10000; // 10 seconds in ms

    addSample(bytesTransferred: number, durationMs: number): void {
      const bandwidth = (bytesTransferred * 8) / (durationMs * 1000); // Mbps
        const timestamp = Date.now();
        this.samples.push([timestamp, bandwidth]);
        this._cleanOldSamples();
    }

    getEstimatedBandwidth(): number {
        if (this.samples.length === 0) return Infinity;
        const bandwidths = this.samples.map(([, b]) => b);
        return this._median(bandwidths);
    }

    private _cleanOldSamples(): void {
        const cutoff = Date.now() - this.windowSize;
        this.samples = this.samples.filter(([t]) => t > cutoff);
    }

    private _median(values: number[]): number {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
}