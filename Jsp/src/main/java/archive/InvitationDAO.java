package archive;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class InvitationDAO {
    private static InvitationDAO instance = new InvitationDAO();

    public static InvitationDAO getInstance() { return instance; }

    private InvitationDAO() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Connection getConnection() {
        try {
            return DriverManager.getConnection(
                "jdbc:mysql://127.0.0.1:3306/archivejsp", "root", "1111");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 초대 전송
    public int sendInvitation(int aid, int inviterUid, int inviteeUid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String SQL = "INSERT INTO archive_invitation(aid, inviter_uid, invitee_uid) VALUES(?, ?, ?)";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, aid);
            pstmt.setInt(2, inviterUid);
            pstmt.setInt(3, inviteeUid);
            return pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }

    // 초대 목록 조회
    public List<InvitationVO> getInvitationList(int inviteeUid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<InvitationVO> list = new ArrayList<>();
        String SQL = "SELECT i.invitation_id, i.aid, a.aname, m.name AS inviter_name, i.created_time " +
                     "FROM archive_invitation i " +
                     "JOIN archive a ON i.aid = a.aid " +
                     "JOIN member m ON i.inviter_uid = m.uid " +
                     "WHERE i.invitee_uid = ? AND i.status = 'pending'";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, inviteeUid);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                InvitationVO vo = new InvitationVO();
                vo.setInvitationId(rs.getInt("invitation_id"));
                vo.setAid(rs.getInt("aid"));
                vo.setAname(rs.getString("aname"));
                vo.setInviterName(rs.getString("inviter_name"));
                vo.setCreatedTime(rs.getString("created_time"));
                list.add(vo);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return list;
    }

    // 수락/거절
    public int respondInvitation(int invitationId, String status) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String SQL = "UPDATE archive_invitation SET status = ? WHERE invitation_id = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setString(1, status);
            pstmt.setInt(2, invitationId);
            return pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }

    // 수락 시 invitee_uid 조회 (매핑용)
    public int[] getInvitationInfo(int invitationId) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "SELECT aid, invitee_uid FROM archive_invitation WHERE invitation_id = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, invitationId);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                return new int[]{ rs.getInt("aid"), rs.getInt("invitee_uid") };
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return null;
    }

    public boolean isMemberOfArchive(int uid, int aid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "SELECT 1 FROM member_permission_mapping WHERE uid = ? AND aid = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, uid);
            pstmt.setInt(2, aid);
            rs = pstmt.executeQuery();
            return rs.next();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return false;
    }

    // 이미 초대 중인지 확인
    public boolean isPendingInvitation(int uid, int aid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "SELECT 1 FROM archive_invitation WHERE invitee_uid = ? AND aid = ? AND status = 'pending'";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, uid);
            pstmt.setInt(2, aid);
            rs = pstmt.executeQuery();
            return rs.next();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return false;
    }
}