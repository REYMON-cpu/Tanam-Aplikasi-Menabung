export default function Bar({ p }) {
  return (
    <div className="track press">
      <div className="fill" style={{ width: Math.min(100, Math.max(0, p)) + '%' }} />
    </div>
  )
}
