interface BrandProps {
    size?: 'default' | 'large';
}

export function Brand({ size = 'default' }: BrandProps) {
    return (
        <div className={`brand ${size === 'large' ? 'brand--large' : ''}`}>
            <span className="brand__mark" aria-hidden />
            <span className="brand__name">
                Rock Nacional<span className="brand__accent">IA</span>
            </span>
        </div>
    );
}
