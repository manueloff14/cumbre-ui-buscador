export default function ChatIcon({ isDarkMode }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
            <path d="M 5.4453125 4.0019531 A 1.50015 1.50015 0 0 0 4.1015625 6.0410156 L 9.6015625 20.242188 A 1.50015 1.50015 0 0 0 10.759766 21.179688 L 25.701172 23.605469 C 26.073404 23.665819 26.037109 23.77328 26.037109 24 C 26.037109 24.22672 26.073399 24.334183 25.701172 24.394531 L 10.759766 26.820312 A 1.50015 1.50015 0 0 0 9.6015625 27.757812 L 4.1015625 41.958984 A 1.50015 1.50015 0 0 0 6.1699219 43.841797 L 43.169922 25.341797 A 1.50015 1.50015 0 0 0 43.169922 22.658203 L 6.1699219 4.1582031 A 1.50015 1.50015 0 0 0 5.4453125 4.0019531 z" fill={isDarkMode ? 'white' : 'black'}></path>
        </svg>
    )
}