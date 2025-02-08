const cloudfrontUrl = "https://d2npnhjbm12f3a.cloudfront.net";

export default function Solo() {

  return (
    <div>
      <h1>Solo Videos</h1>
      <div>
        <h2>2025-01-07</h2>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <video key={`2025-01-07-${i}`} src={`${cloudfrontUrl}/2025-01-07/2025-01-07-${i}.mp4`} controls muted
                   className="w-[320px]" />
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2>2024-12-03</h2>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <video key={`2025-01-07-${i}`} src={`${cloudfrontUrl}/2024-12-03/2024-12-03-${i}.mp4`} controls muted
                   className="w-[320px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
