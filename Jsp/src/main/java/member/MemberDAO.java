package member;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MemberDAO {
    private static MemberDAO instance = new MemberDAO();
    
    public static MemberDAO getInstance() {
        return instance;
    }

    private MemberDAO() {
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

    public int register(MemberVO member) {
        Connection conn = null;
        PreparedStatement pstmt = null;

        String SQL = "INSERT INTO member(id, password, name, email) VALUES(?, ?, ?, ?)";

        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setString(1, member.getId());
            pstmt.setString(2, member.getPassword());
            pstmt.setString(3, member.getName());
            pstmt.setString(4, member.getEmail());
            return pstmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("member 테이블의 register 실패했습니다.");
            
        } finally {
            try { if (pstmt != null) pstmt.close(); } catch (Exception e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (Exception e) { e.printStackTrace(); }
        }

        return -1;
    }

    public int login(String id, String passwd) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int result = -1;
        
        try {
            conn = getConnection();

            String sql = "SELECT id, password FROM member WHERE id = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, id);
            rs = pstmt.executeQuery();
            
            if(rs.next()) {
                String rpassword = rs.getString("password");
                if(passwd.equals(rpassword)) {
                    result = 1; // 로그인 성공
                } else {
                    result = 0; // 비밀번호 불일치
                }
            } else {
                result = -1; // 아이디 없음
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("member 테이블의 login 실패했습니다.");
    
        } finally {
            if(rs != null) try{rs.close(); } catch(SQLException se) {};
            if(pstmt != null)try{pstmt.close(); } catch(SQLException se) {};
            if(conn != null) try{conn.close(); } catch(SQLException se) {};
        }
        
        return result;
    }
    
    public int getUidById(String id) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "SELECT uid FROM member WHERE id = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setString(1, id);
            rs = pstmt.executeQuery();
            if (rs.next()) return rs.getInt("uid");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return -1;
    }
    
    public MemberVO searchMember(String keyword) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String SQL = "SELECT uid, id, name, email FROM member WHERE id = ? OR email = ?";
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(SQL);
            pstmt.setString(1, keyword);
            pstmt.setString(2, keyword);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                MemberVO vo = new MemberVO();
                vo.setUid(rs.getInt("uid"));
                vo.setId(rs.getString("id"));
                vo.setName(rs.getString("name"));
                vo.setEmail(rs.getString("email"));
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
}