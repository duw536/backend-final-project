package archive;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;
import archivePermission.ArchivePermissionVO;

public class ArchiveDAO {
    private static ArchiveDAO instance = new ArchiveDAO();
    
    public static ArchiveDAO getInstance() {
        return instance;
    }

    private ArchiveDAO() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver"); 
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Connection getConnection() {
        try {
            String dbURL = "jdbc:mysql://127.0.0.1:3306/archivejsp"; 
            String dbID = "root";
            String dbPassword = "1111"; 
            return DriverManager.getConnection(dbURL, dbID, dbPassword);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public int createArchive(ArchiveVO archive) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "INSERT INTO archive(uid, aname, aimg_path) VALUES(?, ?, ?)";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL, PreparedStatement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, archive.getUid());
            pstmt.setString(2, archive.getAname());
            pstmt.setString(3, archive.getAimgPath());
            pstmt.executeUpdate();
            rs = pstmt.getGeneratedKeys();
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("archive 테이블의 createArchive 처리 중 실패했습니다.");
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }

    // 관리자 + 기본 권한 동시 생성, 관리자 permission_id 반환
    public int createDefaultPermission(int aid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();

            // 1. 관리자 권한 INSERT
            String SQL1 = "INSERT INTO archive_permission(aid, permission_name, can_manage_member, can_manage_info, can_manage_tag) VALUES(?, '관리자', 1, 1, 1)";
            pstmt = conn.prepareStatement(SQL1, PreparedStatement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, aid);
            pstmt.executeUpdate();
            rs = pstmt.getGeneratedKeys();
            int adminPermissionId = -1;
            if (rs.next()) adminPermissionId = rs.getInt(1);
            rs.close();
            pstmt.close();

            // 2. 기본 권한 INSERT (모든 권한 false)
            String SQL2 = "INSERT INTO archive_permission(aid, permission_name, can_manage_member, can_manage_info, can_manage_tag) VALUES(?, '기본', 0, 0, 0)";
            pstmt = conn.prepareStatement(SQL2);
            pstmt.setInt(1, aid);
            pstmt.executeUpdate();

            return adminPermissionId; // 생성자 매핑용으로 관리자 permission_id 반환

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("archive_permission 테이블의 createDefaultPermission 처리 중 실패했습니다.");
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }

    public int createMemberPermissionMapping(int uid, int aid, int permissionId) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String SQL = "INSERT INTO member_permission_mapping(uid, aid, permission_id) VALUES(?, ?, ?)";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, uid);
            pstmt.setInt(2, aid);
            pstmt.setInt(3, permissionId);
            return pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("member_permission_mapping 테이블의 createMemberPermissionMapping 처리 중 실패했습니다.");
        } finally {
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }

    // 초대 시 기본 permission_id 조회
    public int getDefaultPermissionId(int aid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "SELECT permission_id FROM archive_permission WHERE aid = ? AND permission_name = '기본'";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, aid);
            rs = pstmt.executeQuery();
            if (rs.next()) return rs.getInt("permission_id");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }

    public List<ArchiveVO> getArchiveList(int uid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<ArchiveVO> list = new ArrayList<>();
        String SQL = "SELECT DISTINCT a.aid, a.uid, a.aname, a.aimg_path " +
                     "FROM archive a " +
                     "JOIN member_permission_mapping mpm ON a.aid = mpm.aid " +
                     "WHERE mpm.uid = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, uid);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                ArchiveVO vo = new ArchiveVO();
                vo.setAid(rs.getInt("aid"));
                vo.setUid(rs.getInt("uid"));
                vo.setAname(rs.getString("aname"));
                vo.setAimgPath(rs.getString("aimg_path"));
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

    public List<ArchiveMemberVO> getArchiveMemberList(int aid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<ArchiveMemberVO> list = new ArrayList<>();
        String SQL = "SELECT m.uid, m.name, p.permission_name " +
                     "FROM member_permission_mapping mpm " +
                     "JOIN member m ON mpm.uid = m.uid " +
                     "JOIN archive_permission p ON mpm.permission_id = p.permission_id " +
                     "WHERE mpm.aid = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, aid);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                ArchiveMemberVO vo = new ArchiveMemberVO();
                vo.setUid(rs.getInt("uid"));
                vo.setName(rs.getString("name"));
                vo.setPermissionName(rs.getString("permission_name"));
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
    
    public ArchivePermissionVO getMemberPermission(int uid, int aid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "SELECT p.can_manage_member, p.can_manage_info, p.can_manage_tag " +
                     "FROM member_permission_mapping mpm " +
                     "JOIN archive_permission p ON mpm.permission_id = p.permission_id " +
                     "WHERE mpm.uid = ? AND mpm.aid = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, uid);
            pstmt.setInt(2, aid);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                ArchivePermissionVO vo = new ArchivePermissionVO();
                vo.setCanManageMember(rs.getInt("can_manage_member"));
                vo.setCanManageInfo(rs.getInt("can_manage_info"));
                vo.setCanManageTag(rs.getInt("can_manage_tag"));
                return vo;
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
    
    public List<ArchivePermissionVO> getPermissionList(int aid) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<ArchivePermissionVO> list = new ArrayList<>();
        String SQL = "SELECT permission_id, permission_name FROM archive_permission WHERE aid = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, aid);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                ArchivePermissionVO vo = new ArchivePermissionVO();
                vo.setPermissionId(rs.getInt("permission_id"));
                vo.setPermissionName(rs.getString("permission_name"));
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
}