package info;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class InfoDAO {
    private static InfoDAO instance = new InfoDAO();

    public static InfoDAO getInstance() { return instance; }

    private InfoDAO() {
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

    // 정보 등록 후 info_id 반환
    public int createInfo(InfoVO info) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "INSERT INTO info(aid, uid, info_name, info_content, file_path) VALUES(?, ?, ?, ?, ?)";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL, PreparedStatement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, info.getAid());
            pstmt.setInt(2, info.getUid());
            pstmt.setString(3, info.getInfoName());
            pstmt.setString(4, info.getInfoContent());
            pstmt.setString(5, info.getFilePath());
            pstmt.executeUpdate();
            rs = pstmt.getGeneratedKeys();
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("info 테이블의 createInfo 처리 중 실패했습니다.");
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }

    // 열람 권한 매핑 INSERT
    public int addInfoPermission(int infoId, int permissionId) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String SQL = "INSERT INTO info_permission_mapping(info_id, permission_id) VALUES(?, ?)";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setInt(1, infoId);
            pstmt.setInt(2, permissionId);
            return pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }
}