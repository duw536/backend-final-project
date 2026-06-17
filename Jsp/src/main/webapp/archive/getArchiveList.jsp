<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="archive.ArchiveDAO" %>
<%@ page import="archive.ArchiveVO" %>
<%@ page import="java.util.List" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setContentType("application/json");

    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }

    request.setCharacterEncoding("UTF-8");

    String uidStr = request.getParameter("uid");
    if (uidStr == null || uidStr.equals("null")) {
        out.print("[]");
        return;
    }

    int uid = Integer.parseInt(uidStr);
    List<ArchiveVO> list = ArchiveDAO.getInstance().getArchiveList(uid);

    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < list.size(); i++) {
        ArchiveVO a = list.get(i);
        if (i > 0) sb.append(",");
        sb.append("{")
          .append("\"aid\":").append(a.getAid()).append(",")
          .append("\"aname\":\"").append(a.getAname()).append("\",")
          .append("\"aimgPath\":").append(a.getAimgPath() != null ? "\"" + a.getAimgPath() + "\"" : "null")
          .append("}");
    }
    sb.append("]");
    out.print(sb.toString());
%>