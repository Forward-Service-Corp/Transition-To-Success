export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const timeoutMinutes = parseInt(process.env.SESSION_AUTO_LOGOUT_LENGTH_IN_MINUTES) || 1;

  res.status(200).json({
    timeoutMinutes,
    timeoutMilliseconds: timeoutMinutes * 60 * 1000
  });
}