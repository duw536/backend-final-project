<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.oreilly.servlet.MultipartRequest" %>
<%@ page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy" %>
<%@ page import="info.InfoDAO" %>
<%@ page import="info.InfoVO" %>
<%@ page import="java.io.File" %>

<%
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setContentType("application/json");

    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }

    String uploadPath = request.getServletContext().getRealPath("/upload");
    File dir = new File(uploadPath);
    if (!dir.exists()) dir.mkdirs();

    int maxSize = 1024 * 1024 * 10;

    try {
        MultipartRequest multi = new MultipartRequest(request, uploadPath, maxSize, "UTF-8", new DefaultFileRenamePolicy());

        int aid = Integer.parseInt(multi.getParameter("aid"));
        int uid = Integer.parseInt(multi.getParameter("uid"));
        String infoName = multi.getParameter("infoName");
        String infoContent = multi.getParameter("infoContent");
        String permissionIdsStr = multi.getParameter("permissionIds"); // "1,2,3" 형태

        String filePath = null;
        if (multi.getFilesystemName("file") != null) {
            filePath = "/upload/" + multi.getFilesystemName("file");
        }

        InfoVO info = new InfoVO();
        info.setAid(aid);
        info.setUid(uid);
        info.setInfoName(infoName);
        info.setInfoContent(infoContent);
        info.setFilePath(filePath);

        InfoDAO infoDAO = InfoDAO.getInstance();
        int infoId = infoDAO.createInfo(info);

        if (infoId > 0) {
            // 열람 권한 매핑 INSERT
            if (permissionIdsStr != null && !permissionIdsStr.isEmpty()) {
                String[] permissionIds = permissionIdsStr.split(",");
                for (String permId : permissionIds) {
                    infoDAO.addInfoPermission(infoId, Integer.parseInt(permId.trim()));
                }
            }
            out.print("{\"message\": \"success\"}");
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"message\": \"error\", \"detail\": \"정보 등록 실패\"}");
        }

    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"message\": \"error\", \"detail\": \"처리 중 오류가 발생했습니다.\"}");
    }
%>